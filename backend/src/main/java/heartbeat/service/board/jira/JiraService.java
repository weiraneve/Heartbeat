package heartbeat.service.board.jira;

import feign.FeignException;
import heartbeat.client.JiraFeignClient;
import heartbeat.client.component.JiraUriGenerator;
import heartbeat.client.dto.AllDoneCardsResponseDTO;
import heartbeat.client.dto.CardHistoryResponseDTO;
import heartbeat.client.dto.JiraCard;
import heartbeat.client.dto.FieldResponseDTO;
import heartbeat.client.dto.HistoryDetail;
import heartbeat.client.dto.IssueField;
import heartbeat.client.dto.Issuetype;
import heartbeat.client.dto.JiraBoardConfigDTO;
import heartbeat.client.dto.JiraColumn;
import heartbeat.client.dto.StatusSelfDTO;
import heartbeat.controller.board.vo.CycleTimeInfoDTO;
import heartbeat.controller.board.vo.StatusChangedArrayItem;
import heartbeat.controller.board.vo.request.BoardRequestParam;
import heartbeat.controller.board.vo.request.BoardType;
import heartbeat.controller.board.vo.request.CardStepsEnum;
import heartbeat.controller.board.vo.request.Cards;
import heartbeat.controller.board.vo.request.RequestJiraBoardColumnSetting;
import heartbeat.controller.board.vo.request.StoryPointsAndCycleTimeRequest;
import heartbeat.controller.board.vo.response.BoardConfigResponse;
import heartbeat.controller.board.vo.response.CardCustomFieldKey;
import heartbeat.controller.board.vo.response.CardCycleTime;
import heartbeat.controller.board.vo.response.ColumnValue;
import heartbeat.controller.board.vo.response.CycleTimeInfo;
import heartbeat.controller.board.vo.response.JiraCardResponse;
import heartbeat.controller.board.vo.response.JiraColumnResponse;
import heartbeat.controller.board.vo.response.StepsDay;
import heartbeat.controller.board.vo.response.TargetField;
import heartbeat.exception.RequestFailedException;
import heartbeat.util.BoardUtil;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

@Service
@RequiredArgsConstructor
@Log4j2
public class JiraService {

	@Autowired
	private final ThreadPoolTaskExecutor taskExecutor;

	public static final int QUERY_COUNT = 100;

	private final JiraFeignClient jiraFeignClient;

	private final JiraUriGenerator urlGenerator;

	@PreDestroy
	public void shutdownExecutor() {
		taskExecutor.shutdown();
	}

	private static final String DONE_CARD_TAG = "done";

	private CardCustomFieldKey cardCustomFieldKey;

	public static final List<String> FIELDS_IGNORE = List.of("summary", "description", "attachment", "duedate",
			"issuelinks");

	public BoardConfigResponse getJiraConfiguration(BoardType boardType, BoardRequestParam boardRequestParam) {
		URI baseUrl = urlGenerator.getUri(boardRequestParam.getSite());
		JiraBoardConfigDTO jiraBoardConfigDTO;
		try {
			log.info("[Jira] Start to get configuration for board, board info: " + boardRequestParam);
			jiraBoardConfigDTO = jiraFeignClient.getJiraBoardConfiguration(baseUrl, boardRequestParam.getBoardId(),
					boardRequestParam.getToken());
			log.info("[Jira] Successfully get configuration for board: " + boardRequestParam.getBoardId() + "response: "
					+ jiraBoardConfigDTO);

			CompletableFuture<JiraColumnResult> jiraColumnsFuture = getJiraColumnsAsync(boardRequestParam, baseUrl,
					jiraBoardConfigDTO);
			CompletableFuture<List<TargetField>> targetFieldFuture = getTargetFieldAsync(baseUrl, boardRequestParam);

			return jiraColumnsFuture
				.thenCompose(jiraColumnResult -> getUserAsync(boardType, baseUrl, boardRequestParam,
						jiraColumnResult.getDoneColumns())
					.thenApply(users -> BoardConfigResponse.builder()
						.jiraColumnResponses(jiraColumnResult.getJiraColumnResponses())
						.targetFields(targetFieldFuture.join())
						.users(users)
						.build()))
				.join();
		}
		catch (FeignException e) {
			log.error("[Jira] Failed when call Jira to get board config", e);
			throw new RequestFailedException(e);
		}
		catch (CompletionException e) {
			Throwable cause = e.getCause();
			log.error("[Jira] Failed when call Jira to get board config", cause);
			if (cause instanceof FeignException feignException) {
				throw new RequestFailedException(feignException);
			}
			else if (cause instanceof RequestFailedException requestFailedException) {
				throw requestFailedException;
			}
			throw e;
		}
	}

	private CompletableFuture<JiraColumnResult> getJiraColumnsAsync(BoardRequestParam boardRequestParam, URI baseUrl,
			JiraBoardConfigDTO jiraBoardConfigDTO) {
		return CompletableFuture.supplyAsync(() -> getJiraColumns(boardRequestParam, baseUrl, jiraBoardConfigDTO),
				taskExecutor);
	}

	private JiraColumnResult getJiraColumns(BoardRequestParam boardRequestParam, URI baseUrl,
			JiraBoardConfigDTO jiraBoardConfigDTO) {
		log.info("[Jira] Start to get jira columns, project key: {}, board id: {}, column size: {}",
				boardRequestParam.getProjectKey(), boardRequestParam.getBoardId(),
				jiraBoardConfigDTO.getColumnConfig().getColumns().size());
		List<String> doneColumns = new CopyOnWriteArrayList<>();
		List<CompletableFuture<JiraColumnResponse>> futures = jiraBoardConfigDTO.getColumnConfig()
			.getColumns()
			.stream()
			.map(jiraColumn -> CompletableFuture.supplyAsync(
					() -> getColumnNameAndStatus(jiraColumn, baseUrl, doneColumns, boardRequestParam.getToken()),
					taskExecutor))
			.toList();

		List<JiraColumnResponse> columnResponse = futures.stream()
			.map(CompletableFuture::join)
			.collect(Collectors.toList());

		JiraColumnResult jiraColumnResult = JiraColumnResult.builder()
			.jiraColumnResponses(columnResponse)
			.doneColumns(doneColumns)
			.build();
		log.info(
				"[Jira] Successfully to get jira columns, project key: {}, board id: {}, column result size: {}, done columns: {}",
				boardRequestParam.getProjectKey(), boardRequestParam.getBoardId(),
				jiraColumnResult.getJiraColumnResponses().size(), doneColumns);
		return jiraColumnResult;
	}

	private JiraColumnResponse getColumnNameAndStatus(JiraColumn jiraColumn, URI baseUrl, List<String> doneColumns,
			String token) {
		log.info("[Jira] Start to get column and status, the column name: {} column status: {}", jiraColumn.getName(),
				jiraColumn.getStatuses());
		List<StatusSelfDTO> statusSelfList = getStatusSelfList(baseUrl, jiraColumn, token);
		String key = handleColumKey(doneColumns, statusSelfList);

		JiraColumnResponse jiraColumnResponse = JiraColumnResponse.builder()
			.key(key)
			.value(ColumnValue.builder()
				.name(jiraColumn.getName())
				.statuses(statusSelfList.stream()
					.map(statusSelf -> statusSelf.getUntranslatedName().toUpperCase())
					.collect(Collectors.toList()))
				.build())
			.build();
		log.info("[Jira] Successfully get column and status, the column key: {}, status: {}",
				jiraColumnResponse.getKey(), jiraColumnResponse.getValue().getStatuses());
		return jiraColumnResponse;
	}

	private List<StatusSelfDTO> getStatusSelfList(URI baseUrl, JiraColumn jiraColumn, String token) {
		log.info("[Jira] Start to get columns status self list");
		List<CompletableFuture<StatusSelfDTO>> futures = jiraColumn.getStatuses()
			.stream()
			.map(jiraColumnStatus -> CompletableFuture.supplyAsync(
					() -> jiraFeignClient.getColumnStatusCategory(baseUrl, jiraColumnStatus.getId(), token),
					taskExecutor))
			.toList();
		log.info("[Jira] Successfully get columns status self list");

		return futures.stream().map(CompletableFuture::join).collect(Collectors.toList());
	}

	private String handleColumKey(List<String> doneColumn, List<StatusSelfDTO> statusSelfList) {
		List<String> keyList = new ArrayList<>();
		statusSelfList.forEach(statusSelf -> {
			if (statusSelf.getStatusCategory().getKey().equalsIgnoreCase(DONE_CARD_TAG)) {
				doneColumn.add(statusSelf.getUntranslatedName().toUpperCase());
				keyList.add(DONE_CARD_TAG);
			}
			else {
				keyList.add(statusSelf.getStatusCategory().getName());
			}
		});

		return keyList.contains(DONE_CARD_TAG) ? DONE_CARD_TAG
				: keyList.stream().reduce((pre, last) -> last).orElse("");
	}

	private CompletableFuture<List<String>> getUserAsync(BoardType boardType, URI baseUrl,
			BoardRequestParam boardRequestParam, List<String> doneColumns) {
		return CompletableFuture.supplyAsync(() -> getUsers(boardType, baseUrl, boardRequestParam, doneColumns),
				taskExecutor);
	}

	private List<String> getUsers(BoardType boardType, URI baseUrl, BoardRequestParam boardRequestParam,
			List<String> doneColumns) {
		if (doneColumns.isEmpty()) {
			throw new RequestFailedException(204, "[Jira] There is no done column.");
		}

		List<JiraCard> doneCards = getAllDoneCards(boardType, baseUrl, doneColumns, boardRequestParam);

		if (doneCards.isEmpty()) {
			throw new RequestFailedException(204, "[Jira] There is no done cards.");
		}

		List<CompletableFuture<List<String>>> futures = doneCards.stream()
			.map(doneCard -> CompletableFuture
				.supplyAsync(() -> getAssigneeSet(baseUrl, doneCard, boardRequestParam.getToken()), taskExecutor))
			.toList();

		List<List<String>> assigneeList = futures.stream().map(CompletableFuture::join).toList();
		return assigneeList.stream().flatMap(Collection::stream).distinct().toList();
	}

	private List<JiraCard> getAllDoneCards(BoardType boardType, URI baseUrl, List<String> doneColumns,
			BoardRequestParam boardRequestParam) {
		String jql = parseJiraJql(boardType, doneColumns, boardRequestParam);

		log.info("[Jira] Start to get first-page done card information");
		AllDoneCardsResponseDTO allDoneCardsResponseDTO = jiraFeignClient.getAllDoneCards(baseUrl,
				boardRequestParam.getBoardId(), QUERY_COUNT, 0, jql, boardRequestParam.getToken());
		log.info("[Jira] Successfully get first-page done card information");

		List<JiraCard> doneCards = new ArrayList<>(new HashSet<>(allDoneCardsResponseDTO.getIssues()));

		int pages = (int) Math.ceil(Double.parseDouble(allDoneCardsResponseDTO.getTotal()) / QUERY_COUNT);
		if (pages <= 1) {
			return doneCards;
		}

		log.info("[Jira] Start to get more done card information");
		List<Integer> range = IntStream.rangeClosed(1, pages - 1).boxed().toList();
		List<CompletableFuture<AllDoneCardsResponseDTO>> futures = range.stream()
			.map(startFrom -> CompletableFuture
				.supplyAsync(() -> (jiraFeignClient.getAllDoneCards(baseUrl, boardRequestParam.getBoardId(),
						QUERY_COUNT, startFrom * QUERY_COUNT, jql, boardRequestParam.getToken())), taskExecutor))
			.toList();
		log.info("[Jira] Successfully get more done card information");

		List<AllDoneCardsResponseDTO> doneCardsResponses = futures.stream().map(CompletableFuture::join).toList();
		List<JiraCard> moreDoneCards = doneCardsResponses.stream()
			.flatMap(moreDoneCardsResponses -> moreDoneCardsResponses.getIssues().stream())
			.toList();

		return Stream.concat(doneCards.stream(), moreDoneCards.stream()).toList();
	}

	private String parseJiraJql(BoardType boardType, List<String> doneColumns, BoardRequestParam boardRequestParam) {
		if (boardType == BoardType.JIRA) {
			return String.format(
					"status in ('%s') AND statusCategoryChangedDate >= %s AND statusCategoryChangedDate <= %s",
					String.join("','", doneColumns), boardRequestParam.getStartTime(), boardRequestParam.getEndTime());
		}
		else if (boardType == BoardType.CLASSIC_JIRA) {
			StringBuilder subJql = new StringBuilder();
			for (int index = 0; index < doneColumns.size() - 1; index++) {
				subJql.append(String.format("status changed to '%s' during (%s, %s) or ", doneColumns.get(index),
						boardRequestParam.getStartTime(), boardRequestParam.getEndTime()));
			}
			subJql
				.append(String.format("status changed to '%s' during (%s, %s)", doneColumns.get(doneColumns.size() - 1),
						boardRequestParam.getStartTime(), boardRequestParam.getEndTime()));
			return String.format("status in ('%s') AND (%s)", String.join("', '", doneColumns), subJql);
		}
		else {
			throw new RequestFailedException(400, "[Jira] boardType param is not correct");
		}
	}

	private List<String> getAssigneeSet(URI baseUrl, JiraCard donecard, String jiraToken) {
		log.info("[Jira] Start to get jira card history, key: {},done cards: {}", donecard.getKey(), donecard);
		CardHistoryResponseDTO cardHistoryResponseDTO = jiraFeignClient.getJiraCardHistory(baseUrl, donecard.getKey(),
				jiraToken);
		log.info("[Jira] Successfully get jira card history, key: {},items: {}", donecard.getKey(),
				cardHistoryResponseDTO.getItems());

		List<String> assigneeSet = cardHistoryResponseDTO.getItems()
			.stream()
			.filter(assignee -> Objects.equals(assignee.getFieldId(), "assignee")
					&& assignee.getTo().getDisplayValue() != null)
			.map(assignee -> assignee.getTo().getDisplayValue())
			.toList();

		log.info("[assigneeSet] assigneeSet.isEmpty():{}", assigneeSet.isEmpty());

		if (assigneeSet.isEmpty() && nonNull(donecard.getFields().getAssignee())
				&& nonNull(donecard.getFields().getAssignee().getDisplayName())) {
			return List.of(donecard.getFields().getAssignee().getDisplayName());
		}
		log.info("[Jira] Successfully get assigneeSet:{}", assigneeSet);
		return assigneeSet;
	}

	private CompletableFuture<List<TargetField>> getTargetFieldAsync(URI baseUrl, BoardRequestParam boardRequestParam) {
		return CompletableFuture.supplyAsync(() -> getTargetField(baseUrl, boardRequestParam), taskExecutor);
	}

	private List<TargetField> getTargetField(URI baseUrl, BoardRequestParam boardRequestParam) {
		log.info("[Jira] Start to get target field, project key: {}, board id: {},", boardRequestParam.getProjectKey(),
				boardRequestParam.getBoardId());
		FieldResponseDTO fieldResponse = jiraFeignClient.getTargetField(baseUrl, boardRequestParam.getProjectKey(),
				boardRequestParam.getToken());
		log.info("[Jira] Successfully get target field, project key: {}, board id: {},",
				boardRequestParam.getProjectKey(), boardRequestParam.getBoardId());

		if (isNull(fieldResponse) || fieldResponse.getProjects().isEmpty()) {
			throw new RequestFailedException(204, "[Jira] There is no target field.");
		}

		List<Issuetype> issueTypes = fieldResponse.getProjects().get(0).getIssuetypes();
		List<TargetField> targetFields = issueTypes.stream()
			.flatMap(issuetype -> getTargetIssueField(issuetype.getFields()).stream())
			.distinct()
			.toList();
		log.info("[Jira] Successfully get targetField:{}", targetFields);
		return targetFields;
	}

	private List<TargetField> getTargetIssueField(Map<String, IssueField> fields) {
		return fields.values()
			.stream()
			.filter(issueField -> !FIELDS_IGNORE.contains(issueField.getKey()))
			.map(issueField -> new TargetField(issueField.getKey(), issueField.getName(), false))
			.collect(Collectors.toList());
	}

	public Cards getStoryPointsAndCycleTime(StoryPointsAndCycleTimeRequest request,
			List<RequestJiraBoardColumnSetting> boardColumns, List<String> users) {
		cardCustomFieldKey = saveCustomFieldKey(request);
		BoardType boardType = BoardType.fromValue(request.getType());
		URI baseUrl = urlGenerator.getUri(request.getSite());
		BoardRequestParam boardRequestParam = BoardRequestParam.builder()
			.boardId(request.getBoardId())
			.email("")
			.projectKey(request.getProject())
			.site(request.getSite())
			.token(request.getToken())
			.startTime(request.getStartTime())
			.endTime(request.getEndTime())
			.build();
		List<JiraCard> allDoneCards = getAllDoneCards(boardType, baseUrl, request.getStatus(), boardRequestParam);

		List<JiraCardResponse> matchedCards = new ArrayList<>();
		allDoneCards.forEach(doneCard -> {
			CycleTimeInfoDTO cycleTimeInfoDTO = getCycleTime(baseUrl, doneCard.getKey(), request.getToken(),
					request.isTreatFlagCardAsBlock());
			ArrayList<String> assigneeSet = new ArrayList<>(getAssigneeSet(baseUrl, doneCard, request.getToken()));
			if (doneCard.getFields().getAssignee() != null
					&& doneCard.getFields().getAssignee().getDisplayName() != null) {
				assigneeSet.add(doneCard.getFields().getAssignee().getDisplayName());
			}
			if (users.stream().anyMatch(assigneeSet::contains)) {
				// TODO:this logic is unnecessary processCustomFieldsForCard(doneCard)
				doneCard.getFields().setLabel(String.join(",", doneCard.getFields().getLabel()));

				JiraCardResponse jiraCardResponse = JiraCardResponse.builder()
					.baseInfo(doneCard)
					.cycleTime(cycleTimeInfoDTO.getCycleTimeInfos())
					.originCycleTime(cycleTimeInfoDTO.getOriginCycleTimeInfos())
					.cardCycleTime(calculateCardCycleTime(doneCard.getKey(), cycleTimeInfoDTO.getCycleTimeInfos(),
							boardColumns))
					.build();
				matchedCards.add(jiraCardResponse);
			}
		});

		int storyPointSum = matchedCards.stream()
			.mapToInt(card -> card.getBaseInfo().getFields().getStoryPoints())
			.sum();

		return Cards.builder()
			.storyPointSum(storyPointSum)
			.cardsNumber(matchedCards.size())
			.jiraCardResponseList(matchedCards)
			.build();
	}

	private CardCustomFieldKey saveCustomFieldKey(StoryPointsAndCycleTimeRequest model) {
		CardCustomFieldKey cardCustomFieldKey = CardCustomFieldKey.builder().build();
		for (TargetField value : model.getTargetFields()) {
			switch (value.getName()) {
				case "Story Points", "Story point estimate" -> cardCustomFieldKey.setSTORY_POINTS(value.getKey());
				case "Sprint" -> cardCustomFieldKey.setSPRINT(value.getKey());
				case "Flagged" -> cardCustomFieldKey.setFLAGGED(value.getKey());
				default -> {
				}
			}
		}
		return cardCustomFieldKey;
	}

	private CycleTimeInfoDTO getCycleTime(URI baseUrl, String doneCardKey, String token, Boolean treatFlagCardAsBlock) {
		CardHistoryResponseDTO cardHistoryResponseDTO = jiraFeignClient.getJiraCardHistory(baseUrl, doneCardKey, token);
		List<StatusChangedArrayItem> statusChangedArray = putStatusChangeEventsIntoAnArray(cardHistoryResponseDTO,
				treatFlagCardAsBlock);
		List<StatusChangedArrayItem> statusChangeArrayWithoutFlag = putStatusChangeEventsIntoAnArray(
				cardHistoryResponseDTO, true);

		BoardUtil boardUtil = new BoardUtil();
		List<CycleTimeInfo> cycleTimeInfos = boardUtil
			.getCardTimeForEachStep(boardUtil.reformTimeLineForFlaggedCards(statusChangedArray));
		List<CycleTimeInfo> originCycleTimeInfos = boardUtil
			.getCardTimeForEachStep(boardUtil.reformTimeLineForFlaggedCards(statusChangeArrayWithoutFlag));

		return CycleTimeInfoDTO.builder()
			.cycleTimeInfos(cycleTimeInfos)
			.originCycleTimeInfos(originCycleTimeInfos)
			.build();
	}

	private List<StatusChangedArrayItem> putStatusChangeEventsIntoAnArray(CardHistoryResponseDTO jiraCardHistory,
			Boolean treatFlagCardAsBlock) {
		List<StatusChangedArrayItem> statusChangedArray = new ArrayList<>();
		List<HistoryDetail> statusActivities = jiraCardHistory.getItems()
			.stream()
			.filter(activity -> "status".equals(activity.getFieldId()))
			.toList();

		if (jiraCardHistory.getItems().size() > 0 && statusActivities.size() > 0) {
			statusChangedArray.add(StatusChangedArrayItem.builder()
				.timestamp(jiraCardHistory.getItems().get(0).getTimeStamp() - 1)
				.status(statusActivities.get(0).getFrom().getDisplayValue())
				.build());

			jiraCardHistory.getItems()
				.stream()
				.filter(activity -> "status".equals(activity.getFieldId()))
				.forEach(activity -> statusChangedArray.add(StatusChangedArrayItem.builder()
					.timestamp(activity.getTimeStamp())
					.status(activity.getTo().getDisplayValue())
					.build()));
		}

		if (treatFlagCardAsBlock) {
			jiraCardHistory.getItems()
				.stream()
				.filter(activity -> "flogged".equals(activity.getFieldId()))
				.forEach(activity -> {
					if ("Impediment".equals(activity.getTo().getDisplayValue())) {
						statusChangedArray.add(StatusChangedArrayItem.builder()
							.timestamp(activity.getTimeStamp())
							.status(CardStepsEnum.FLAG.getValue())
							.build());
					}
					else {
						statusChangedArray.add(StatusChangedArrayItem.builder()
							.timestamp(activity.getTimeStamp())
							.status(CardStepsEnum.REMOVEFLAG.getValue())
							.build());
					}
				});
		}
		return statusChangedArray;

	}

	private CardCycleTime calculateCardCycleTime(String cardId, List<CycleTimeInfo> cycleTimeInfos,
			List<RequestJiraBoardColumnSetting> boardColumns) {
		Map<String, CardStepsEnum> boardMap = selectedStepsArrayToMap(boardColumns);
		StepsDay stepsDay = StepsDay.builder().build();
		double total = 0;

		for (CycleTimeInfo cycleTimeInfo : cycleTimeInfos) {
			String swimLane = cycleTimeInfo.getColumn();
			if (swimLane.equals("FLAG")) {
				boardMap.put(swimLane.toUpperCase(), CardStepsEnum.BLOCK);
			}
			if (boardMap.containsKey(swimLane.toUpperCase())) {
				CardStepsEnum cardStep = boardMap.get(swimLane);
				switch (cardStep) {
					case DEVELOPMENT -> {
						stepsDay.setDevelopment(stepsDay.getDevelopment() + cycleTimeInfo.getDay());
						total += cycleTimeInfo.getDay();
					}
					case WAITING -> {
						stepsDay.setWaiting(stepsDay.getWaiting() + cycleTimeInfo.getDay());
						total += cycleTimeInfo.getDay();
					}
					case TESTING -> {
						stepsDay.setTesting(stepsDay.getTesting() + cycleTimeInfo.getDay());
						total += cycleTimeInfo.getDay();
					}
					case BLOCK -> {
						stepsDay.setBlocked(stepsDay.getBlocked() + cycleTimeInfo.getDay());
						total += cycleTimeInfo.getDay();
					}
					case REVIEW -> {
						stepsDay.setReview(stepsDay.getReview() + cycleTimeInfo.getDay());
						total += cycleTimeInfo.getDay();
					}
					default -> {
					}
				}
			}
		}
		return CardCycleTime.builder().name(cardId).steps(stepsDay).total(total).build();
	}

	private Map<String, CardStepsEnum> selectedStepsArrayToMap(List<RequestJiraBoardColumnSetting> boardColumns) {
		Map<String, CardStepsEnum> map = new HashMap<>();
		for (RequestJiraBoardColumnSetting boardColumn : boardColumns) {
			map.put(boardColumn.getName().toUpperCase(), CardStepsEnum.valueOf(boardColumn.getValue()));
		}
		return map;
	}

}
