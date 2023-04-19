package heartbeat.controller.board.vo.response;

import heartbeat.client.dto.JiraCard;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JiraCards {

	private Integer total;

	private List<JiraCard> issues;

}
