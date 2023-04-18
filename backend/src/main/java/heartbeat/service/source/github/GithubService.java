package heartbeat.service.source.github;

import feign.FeignException;
import heartbeat.client.GithubFeignClient;
import heartbeat.client.dto.codebase.github.GitHubOrganizationsInfo;
import heartbeat.client.dto.codebase.github.GitHubRepos;
import heartbeat.controller.source.dto.GitHubResponse;
import heartbeat.exception.RequestFailedException;
import heartbeat.util.TokenUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class GithubService {

	private final GithubFeignClient githubFeignClient;

	public GitHubResponse verifyToken(String githubToken) {
		String token = "token " + githubToken;
		try {
			log.info("[Github] Start to query repository_url by token, token: " + TokenUtil.mask(token));
			List<String> githubReposByUser = githubFeignClient.getAllRepos(token)
				.stream()
				.map(GitHubRepos::getHtml_url)
				.toList();
			log.info("[Github] Successfully get repository_url by token, token: " + TokenUtil.mask(token) + " repos: "
					+ githubReposByUser);

			log.info("[Github] Start to query organization_url by token, token: " + TokenUtil.mask(token));
			List<GitHubOrganizationsInfo> githubOrganizations = githubFeignClient.getGithubOrganizationsInfo(token);
			log.info("[Github] Successfully get organizations by token, token: " + TokenUtil.mask(token)
					+ " organizations: " + githubOrganizations);

			LinkedHashSet<String> githubRepos = new LinkedHashSet<>(githubReposByUser);

			log.info("[Github] Start to query repository_url by organization_name and token, token: "
					+ TokenUtil.mask(token));
			Set<String> githubReposByOrganizations = getAllGithubRepos(token, githubOrganizations);
			githubRepos.addAll(githubReposByOrganizations);
			log.info("[Github] Successfully get all repository_url, token: " + TokenUtil.mask(token) + " repos: "
					+ githubRepos);

			return GitHubResponse.builder().githubRepos(githubRepos).build();
		}
		catch (FeignException e) {
			log.error("Failed when call Github with token", e);
			throw new RequestFailedException(e);
		}
	}

	private Set<String> getAllGithubRepos(String token, List<GitHubOrganizationsInfo> githubOrganizations) {
		return githubOrganizations.stream()
			.map(GitHubOrganizationsInfo::getLogin)
			.flatMap(org -> githubFeignClient.getReposByOrganizationName(org, token)
				.stream()
				.map(GitHubRepos::getHtml_url))
			.collect(Collectors.toSet());
	}

}
