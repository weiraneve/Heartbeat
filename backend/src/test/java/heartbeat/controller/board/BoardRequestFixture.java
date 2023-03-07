package heartbeat.controller.board;

import static heartbeat.service.jira.JiraBoardConfigDTOFixture.BOARD_ID;
import static heartbeat.service.jira.JiraBoardConfigDTOFixture.BOARD_NAME;

import heartbeat.controller.board.vo.request.BoardRequest;

public class BoardRequestFixture {

    public static BoardRequest.BoardRequestBuilder BOARD_REQUEST_BUILDER() {
        return BoardRequest.builder()
                .boardName(BOARD_NAME)
                .boardId(BOARD_ID)
                .email("test@email.com")
                .projectKey("project key")
                .site("site")
                .token("token")
                .startTime("1672556350000")
                .endTime("1676908799000");
    }

}
