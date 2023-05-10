package heartbeat.client.dto.board.jira;

import heartbeat.controller.board.dto.response.CardParent;
import heartbeat.controller.board.dto.response.FixVersion;
import heartbeat.controller.board.dto.response.IssueType;
import heartbeat.controller.board.dto.response.JiraProject;
import heartbeat.controller.board.dto.response.Priority;
import heartbeat.controller.board.dto.response.Reporter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class JiraCardField {

	private Assignee assignee;

	private String summary;

	private Status status;

	private IssueType issuetype;

	private Reporter reporter;

	private String statusCategoryChangeDate;

	private int storyPoints;

	private List<FixVersion> fixVersions;

	private JiraProject project;

	private Priority priority;

	private CardParent parent;

	private String label;

}