package heartbeat.client.dto.codebase.github;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class License {

	private String key;

	private String name;

	@JsonProperty("spdx_id")
	private String spdxId;

	private String url;

	@JsonProperty("node_id")
	private String nodeId;

}
