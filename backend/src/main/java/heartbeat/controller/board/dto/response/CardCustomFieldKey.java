package heartbeat.controller.board.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CardCustomFieldKey {

	private String STORY_POINTS;

	private String SPRINT;

	private String FLAGGED;

}