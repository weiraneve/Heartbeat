package heartbeat.controller.pipeline;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import heartbeat.client.dto.PipelineDTO;
import heartbeat.controller.pipeline.vo.response.BuildKiteResponse;
import heartbeat.service.pipeline.buildkite.BuildKiteService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.AutoConfigureJsonTesters;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.io.File;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PipelineController.class)
@ExtendWith(SpringExtension.class)
@AutoConfigureJsonTesters
public class BuildKiteControllerTest {

	@MockBean
	private BuildKiteService buildKiteService;

	@Autowired
	private MockMvc mockMvc;

	@Test
	void shouldReturnCorrectPipelineInfoWhenCallBuildKiteMockServer() throws Exception {
		ObjectMapper mapper = new ObjectMapper();
		List<PipelineDTO> pipelineDTOS = mapper.readValue(
				new File("src/test/java/heartbeat/controller/pipeline/pipelineInfoData.json"), new TypeReference<>() {
				});
		BuildKiteResponse buildKiteResponse = BuildKiteResponse.builder().pipelineList(pipelineDTOS).build();
		when(buildKiteService.fetchPipelineInfo()).thenReturn(buildKiteResponse);

		MockHttpServletResponse response = mockMvc
			.perform(get("/pipelines/buildKite").contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk())
			.andReturn()
			.getResponse();
		final var resultId = JsonPath.parse(response.getContentAsString()).read("$.pipelineList[0].id").toString();
		assertThat(resultId).contains("0186104b-aa31-458c-a58c-63266806f2fe");
		final var resultName = JsonPath.parse(response.getContentAsString()).read("$.pipelineList[0].name").toString();
		assertThat(resultName).contains("payment-selector-ui");
	}

}