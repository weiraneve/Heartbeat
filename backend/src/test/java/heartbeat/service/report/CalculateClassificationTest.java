package heartbeat.service.report;

import heartbeat.client.dto.board.jira.Assignee;
import heartbeat.client.dto.board.jira.JiraCard;
import heartbeat.client.dto.board.jira.JiraCardField;
import heartbeat.client.dto.board.jira.Status;
import heartbeat.controller.board.dto.response.*;
import heartbeat.controller.report.dto.response.Classification;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class CalculateClassificationTest {

	@InjectMocks
	CalculateClassification calculateClassification;

	@Test
	void shouldReturnClassificationFields() {
		List<TargetField> mockTargetFields = List.of(
				TargetField.builder().key("priority").name("Priority").flag(true).build(),
				TargetField.builder().key("timetracking").name("Time tracking").flag(false).build(),
				TargetField.builder().key("sprint").name("Sprint").flag(false).build());

		List<JiraCardDTO> mockJiraCards = Arrays.asList(JiraCardDTO.builder()
			.baseInfo(JiraCard.builder()
				.key("key1")
				.fields(JiraCardField.builder()
					.assignee(Assignee.builder().displayName("value1").build())
					.summary("test")
					.issuetype(IssueType.builder().name("test").build())
					.reporter(Reporter.builder().displayName("Shawn").build())
					.statusCategoryChangeDate("test")
					.storyPoints(3)
					.priority(Priority.builder().name("Top").build())
					.fixVersions(List.of())
					.project(JiraProject.builder().build())
					.parent(CardParent.builder().build())
					.label("testLabel")
					.build())
				.build())
			.build());

		CardCollection mockCards = CardCollection.builder()
			.cardsNumber(3)
			.storyPointSum(3)
			.jiraCardDTOList(mockJiraCards)
			.build();

		List<Classification> classifications = calculateClassification.calculateClassification(mockTargetFields,
				mockCards);

		assertEquals(1, classifications.size());

		Classification classification = classifications.get(0);
		assertEquals("Priority", classification.getFieldName());
	}

	@Test
	void shouldReturnClassificationFieldsWhenObjIsNotArrayObject() {
		List<TargetField> mockTargetFields = List.of(
				TargetField.builder().key("priority").name("Priority").flag(true).build(),
				TargetField.builder().key("timetracking").name("Time tracking").flag(false).build(),
				TargetField.builder().key("sprint").name("Sprint").flag(false).build());

		List<JiraCardDTO> mockJiraCards = Arrays.asList(JiraCardDTO.builder()
			.baseInfo(JiraCard.builder()
				.key("key1")
				.fields(JiraCardField.builder()
					.assignee(Assignee.builder().displayName("value1").build())
					.summary("test")
					.issuetype(IssueType.builder().name("test").build())
					.reporter(Reporter.builder().displayName("Shawn").build())
					.statusCategoryChangeDate("test")
					.storyPoints(3)
					.priority(Priority.builder().name("Top").build())
					.fixVersions(List.of(FixVersion.builder().name("sprint1").build(),
							FixVersion.builder().name("sprint2").build()))
					.project(JiraProject.builder().build())
					.parent(CardParent.builder().build())
					.label("testLabel")
					.build())
				.build())
			.build());

		CardCollection mockCards = CardCollection.builder()
			.cardsNumber(3)
			.storyPointSum(3)
			.jiraCardDTOList(mockJiraCards)
			.build();

		for (TargetField targetField : mockTargetFields) {
			if (targetField.isFlag()) {
				Map<String, Integer> innerMap = new HashMap<>();
				Map<String, Map<String, Integer>> resultMap = new HashMap<>();
				innerMap.put("None", mockCards.getCardsNumber());
				resultMap.put(targetField.getKey(), innerMap);
			}
		}

		List<Classification> classifications = calculateClassification.calculateClassification(mockTargetFields,
				mockCards);

		assertEquals(1, classifications.size());

		Classification classification = classifications.get(0);
		assertEquals("Priority", classification.getFieldName());
	}

	@Test
	void shouldReturnClassificationFieldsWhenObjIsArrayObject() {
		List<TargetField> mockTargetFields = List.of(
				TargetField.builder().key("priority").name("Priority").flag(true).build(),
				TargetField.builder().key("timetracking").name("Time tracking").flag(false).build(),
				TargetField.builder().key("sprint").name("Sprint").flag(false).build());

		List<JiraCardDTO> mockJiraCards = Arrays.asList(JiraCardDTO.builder()
			.baseInfo(JiraCard.builder()
				.key("key1")
				.fields(JiraCardField.builder()
					.assignee(Assignee.builder().displayName("value1").build())
					.summary("test")
					.issuetype(IssueType.builder().name("test").build())
					.reporter(Reporter.builder().displayName("Shawn").build())
					.statusCategoryChangeDate("test")
					.storyPoints(3)
					.priority(Priority.builder().name("Top").build())
					.fixVersions(List.of(FixVersion.builder().name("sprint1").build(),
							FixVersion.builder().name("sprint2").build()))
					.project(JiraProject.builder().build())
					.parent(CardParent.builder().build())
					.label("testLabel")
					.build())
				.build())
			.build());

		CardCollection mockCards = CardCollection.builder()
			.cardsNumber(3)
			.storyPointSum(3)
			.jiraCardDTOList(mockJiraCards)
			.build();

		for (TargetField targetField : mockTargetFields) {
			if (targetField.isFlag()) {
				Map<String, Integer> innerMap = new HashMap<>();
				Map<String, Map<String, Integer>> resultMap = new HashMap<>();
				innerMap.put("None", mockCards.getCardsNumber());
				resultMap.put(targetField.getKey(), innerMap);
			}
		}

		List<Classification> classifications = calculateClassification.calculateClassification(mockTargetFields,
				mockCards);

		assertEquals(1, classifications.size());

		Classification classification = classifications.get(0);
		assertEquals("Priority", classification.getFieldName());
	}

	@Test
	void shouldReturnClassificationNotInMapArrayFields() {
		List<TargetField> mockTargetFields = List.of(
				TargetField.builder().key("priority").name("Priority").flag(true).build(),
				TargetField.builder().key("fixVersions").name("Fix versions").flag(false).build(),
				TargetField.builder().key("sprint").name("Sprint").flag(false).build());

		List<JiraCardDTO> mockJiraCards = Arrays.asList(JiraCardDTO.builder()
			.baseInfo(JiraCard.builder()
				.key("key1")
				.fields(JiraCardField.builder()
					.assignee(Assignee.builder().displayName("value1").build())
					.summary("test")
					.issuetype(IssueType.builder().name("test").build())
					.reporter(Reporter.builder().displayName("Shawn").build())
					.statusCategoryChangeDate("test")
					.storyPoints(3)
					.priority(Priority.builder().name("Top").build())
					.fixVersions(List.of(FixVersion.builder().name("sprint1").build(),
							FixVersion.builder().name("sprint2").build(), FixVersion.builder().name("sprint3").build(),
							FixVersion.builder().name("sprint4").build()))
					.project(JiraProject.builder().build())
					.parent(CardParent.builder().build())
					.label("testLabel")
					.build())
				.build())
			.build());

		CardCollection mockCards = CardCollection.builder()
			.cardsNumber(5)
			.storyPointSum(3)
			.jiraCardDTOList(mockJiraCards)
			.build();

		List<Classification> classifications = calculateClassification.calculateClassification(mockTargetFields,
				mockCards);

		assertEquals(1, classifications.size());

		Classification classification = classifications.get(0);
		assertEquals("Priority", classification.getFieldName());
	}

	@Test
	void shouldReturnClassificationInMapArrayFields() {
		List<TargetField> mockTargetFields = List.of(
				TargetField.builder().key("priority").name("Priority").flag(false).build(),
				TargetField.builder().key("fixVersions").name("Fix versions").flag(true).build(),
				TargetField.builder().key("sprint").name("Sprint").flag(false).build());

		List<JiraCardDTO> mockJiraCards = Arrays.asList(JiraCardDTO.builder()
			.baseInfo(JiraCard.builder()
				.key("key1")
				.fields(JiraCardField.builder()
					.assignee(Assignee.builder().displayName("value1").build())
					.summary("test")
					.issuetype(IssueType.builder().name("test").build())
					.reporter(Reporter.builder().displayName("Shawn").build())
					.statusCategoryChangeDate("test")
					.storyPoints(3)
					.priority(Priority.builder().name("Top").build())
					.fixVersions(List.of(FixVersion.builder().name("sprint1").build(),
							FixVersion.builder().name("sprint2").build()))
					.project(JiraProject.builder().build())
					.parent(CardParent.builder().build())
					.label("testLabel")
					.build())
				.build())
			.build());

		CardCollection mockCards = CardCollection.builder()
			.cardsNumber(5)
			.storyPointSum(3)
			.jiraCardDTOList(mockJiraCards)
			.build();

		List<Classification> classifications = calculateClassification.calculateClassification(mockTargetFields,
				mockCards);

		assertEquals(1, classifications.size());

		Classification classification = classifications.get(0);
		assertEquals("Fix versions", classification.getFieldName());
		assertEquals("sprint1", classification.getPairs().get(0).getName());
		assertEquals("20.00%", classification.getPairs().get(0).getValue());
		assertEquals("sprint2", classification.getPairs().get(1).getName());
		assertEquals("20.00%", classification.getPairs().get(1).getValue());
	}

	@Test
	void shouldReturnClassificationForDisplayName() {
		List<TargetField> mockTargetFields = List.of(
				TargetField.builder().key("assignee").name("Assignee").flag(true).build(),
				TargetField.builder().key("fixVersions").name("Fix versions").flag(false).build(),
				TargetField.builder().key("sprint").name("Sprint").flag(false).build());

		List<JiraCardDTO> mockJiraCards = Arrays.asList(
				JiraCardDTO.builder()
					.baseInfo(JiraCard.builder()
						.key("key1")
						.fields(JiraCardField.builder()
							.assignee(Assignee.builder().displayName("value1").build())
							.summary("test")
							.issuetype(IssueType.builder().name("test").build())
							.reporter(Reporter.builder().displayName("Shawn").build())
							.statusCategoryChangeDate("test")
							.storyPoints(3)
							.priority(Priority.builder().name("Top").build())
							.fixVersions(List.of(FixVersion.builder().name("sprint1").build(),
									FixVersion.builder().name("sprint2").build(),
									FixVersion.builder().name("sprint3").build(),
									FixVersion.builder().name("sprint4").build()))
							.project(JiraProject.builder().build())
							.parent(CardParent.builder().build())
							.label("testLabel")
							.build())
						.build())
					.build(),
				JiraCardDTO.builder()
					.baseInfo(JiraCard.builder()
						.key("key1")
						.fields(JiraCardField.builder()
							.assignee(Assignee.builder().displayName("value2").build())
							.summary("test")
							.issuetype(IssueType.builder().name("test").build())
							.reporter(Reporter.builder().displayName("Shawn").build())
							.statusCategoryChangeDate("test")
							.storyPoints(3)
							.priority(Priority.builder().name("Top").build())
							.fixVersions(List.of(FixVersion.builder().name("sprint1").build(),
									FixVersion.builder().name("sprint2").build(),
									FixVersion.builder().name("sprint3").build(),
									FixVersion.builder().name("sprint4").build()))
							.project(JiraProject.builder().build())
							.parent(CardParent.builder().build())
							.label("testLabel")
							.build())
						.build())
					.build());

		CardCollection mockCards = CardCollection.builder()
			.cardsNumber(2)
			.storyPointSum(3)
			.jiraCardDTOList(mockJiraCards)
			.build();

		List<Classification> classifications = calculateClassification.calculateClassification(mockTargetFields,
				mockCards);

		assertEquals(1, classifications.size());

		Classification classification = classifications.get(0);
		assertEquals("Assignee", classification.getFieldName());
		assertEquals("value2", classification.getPairs().get(0).getName());
		assertEquals("50.00%", classification.getPairs().get(0).getValue());
		assertEquals("value1", classification.getPairs().get(1).getName());
		assertEquals("50.00%", classification.getPairs().get(1).getValue());
	}

	@Test
	void shouldReturnClassificationForKey() {
		List<TargetField> mockTargetFields = List.of(
				TargetField.builder().key("project").name("Project").flag(true).build(),
				TargetField.builder().key("fixVersions").name("Fix versions").flag(false).build(),
				TargetField.builder().key("assignee").name("Assignee").flag(true).build());

		List<JiraCardDTO> mockJiraCards = Arrays.asList(
				JiraCardDTO.builder()
					.baseInfo(JiraCard.builder()
						.key("key1")
						.fields(JiraCardField.builder()
							.assignee(Assignee.builder().displayName("value1").build())
							.summary("test")
							.issuetype(IssueType.builder().name("test").build())
							.reporter(Reporter.builder().displayName("Shawn").build())
							.statusCategoryChangeDate("test")
							.storyPoints(3)
							.priority(Priority.builder().name("Top").build())
							.fixVersions(List.of(FixVersion.builder().name("sprint1").build(),
									FixVersion.builder().name("sprint2").build(),
									FixVersion.builder().name("sprint3").build(),
									FixVersion.builder().name("sprint4").build()))
							.project(JiraProject.builder().id("001").key("project").name("heartBeat").build())
							.parent(CardParent.builder().build())
							.label("testLabel")
							.build())
						.build())
					.build(),
				JiraCardDTO.builder()
					.baseInfo(JiraCard.builder()
						.key("key1")
						.fields(JiraCardField.builder()
							.assignee(Assignee.builder().displayName("value2").build())
							.summary("test")
							.issuetype(IssueType.builder().name("test").build())
							.reporter(Reporter.builder().displayName("Shawn").build())
							.statusCategoryChangeDate("test")
							.storyPoints(3)
							.priority(Priority.builder().name("Top").build())
							.fixVersions(List.of(FixVersion.builder().name("sprint1").build(),
									FixVersion.builder().name("sprint2").build(),
									FixVersion.builder().name("sprint3").build(),
									FixVersion.builder().name("sprint4").build()))
							.project(JiraProject.builder().id("002").key("project2").name("heartBeat").build())
							.parent(CardParent.builder().build())
							.label("testLabel")
							.build())
						.build())
					.build(),
				JiraCardDTO.builder()
					.baseInfo(JiraCard.builder()
						.key("key1")
						.fields(JiraCardField.builder()
							.assignee(Assignee.builder().displayName("value3").build())
							.summary("test")
							.issuetype(IssueType.builder().name("test").build())
							.reporter(Reporter.builder().displayName("Shawn").build())
							.statusCategoryChangeDate("test")
							.storyPoints(3)
							.priority(Priority.builder().name("Top").build())
							.fixVersions(List.of(FixVersion.builder().name("sprint1").build(),
									FixVersion.builder().name("sprint2").build(),
									FixVersion.builder().name("sprint3").build(),
									FixVersion.builder().name("sprint4").build()))
							.project(JiraProject.builder().id("003").key("project2").name("heartBeat").build())
							.parent(CardParent.builder().build())
							.label("testLabel")
							.build())
						.build())
					.build());

		CardCollection mockCards = CardCollection.builder()
			.cardsNumber(3)
			.storyPointSum(3)
			.jiraCardDTOList(mockJiraCards)
			.build();

		List<Classification> classifications = calculateClassification.calculateClassification(mockTargetFields,
				mockCards);

		assertEquals(2, classifications.size());

		Classification classification = classifications.get(0);
		assertEquals("Project", classification.getFieldName());
	}

	@Test
	void shouldReturnNoneClassificationWithNoneTargetFields() {
		List<TargetField> mockTargetFields = List.of(
				TargetField.builder().key("project").name("Project").flag(false).build(),
				TargetField.builder().key("fixVersions").name("Fix versions").flag(false).build(),
				TargetField.builder().key("assignee").name("Assignee").flag(false).build());

		List<JiraCardDTO> mockJiraCards = Arrays.asList(JiraCardDTO.builder()
			.baseInfo(JiraCard.builder()
				.key("key1")
				.fields(JiraCardField.builder()
					.assignee(Assignee.builder().displayName("value1").build())
					.summary("test")
					.issuetype(IssueType.builder().name("test").build())
					.reporter(Reporter.builder().displayName("Shawn").build())
					.statusCategoryChangeDate("test")
					.storyPoints(3)
					.priority(Priority.builder().name("Top").build())
					.fixVersions(List.of(FixVersion.builder().name("sprint1").build(),
							FixVersion.builder().name("sprint2").build(), FixVersion.builder().name("sprint3").build(),
							FixVersion.builder().name("sprint4").build()))
					.project(JiraProject.builder().id("001").key("project").name("heartBeat").build())
					.parent(CardParent.builder().build())
					.label("testLabel")
					.build())
				.build())
			.build());

		CardCollection mockCards = CardCollection.builder()
			.cardsNumber(1)
			.storyPointSum(3)
			.jiraCardDTOList(mockJiraCards)
			.build();

		List<Classification> classifications = calculateClassification.calculateClassification(mockTargetFields,
				mockCards);

		assertEquals(0, classifications.size());
	}

	@Test
	void shouldReturnNoneClassificationWithArrayObjIsNoneAndTargetFieldsIsNone() {
		List<TargetField> mockTargetFields = List
			.of(TargetField.builder().key("assignee").name("Assignee").flag(false).build());

		List<JiraCardDTO> mockJiraCards = Arrays.asList(JiraCardDTO.builder()
			.baseInfo(JiraCard.builder()
				.key("key1")
				.fields(JiraCardField.builder()
					.assignee(Assignee.builder().build())
					.fixVersions(List.of(FixVersion.builder().build(), FixVersion.builder().build()))
					.build())
				.build())
			.build());

		CardCollection mockCards = CardCollection.builder()
			.cardsNumber(1)
			.storyPointSum(3)
			.jiraCardDTOList(mockJiraCards)
			.build();

		List<Classification> classifications = calculateClassification.calculateClassification(mockTargetFields,
				mockCards);

		assertEquals(0, classifications.size());
	}

	@Test
	void shouldReturnNoneClassificationWithDisplayValue() {
		List<TargetField> mockTargetFields = List
			.of(TargetField.builder().key("status").name("Status").flag(true).build());

		List<JiraCardDTO> mockJiraCards = Arrays.asList(JiraCardDTO.builder()
			.baseInfo(JiraCard.builder()
				.key("key1")
				.fields(JiraCardField.builder()
					.status(Status.builder().displayValue("testValue").build())
					.fixVersions(List.of(FixVersion.builder().build(), FixVersion.builder().build()))
					.build())
				.build())
			.build());

		CardCollection mockCards = CardCollection.builder()
			.cardsNumber(1)
			.storyPointSum(3)
			.jiraCardDTOList(mockJiraCards)
			.build();

		List<Classification> classifications = calculateClassification.calculateClassification(mockTargetFields,
				mockCards);

		assertEquals(1, classifications.size());
		assertEquals("Status", classifications.get(0).getFieldName());
		assertEquals("testValue", classifications.get(0).getPairs().get(0).getName());
	}

}
