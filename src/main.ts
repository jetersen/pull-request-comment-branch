import { getInput, setFailed, setOutput } from "@actions/core";
import { context, getOctokit } from "@actions/github";

import { pullRequestDetails } from "./PullRequests";

export async function run() {
  try {
    const client = getOctokit(getInput("repo_token", { required: true }));

    const { data: { pull_request } } = await client.issues.get({
      ...context.repo,
      issue_number: context.issue.number,
    });

    if (!pull_request) {
      throw Error("Comment is not on a pull request");
    }

    const {
      base_ref,
      base_sha,
      head_ref,
      head_sha,
    } = await pullRequestDetails(
      client,
      context.repo.owner,
      context.repo.repo,
      context.issue.number,
    );

    setOutput("head_ref", head_ref);
    setOutput("head_sha", head_sha);
    setOutput("base_ref", base_ref);
    setOutput("base_sha", base_sha);

    // Deprecated
    setOutput("ref", head_ref);
    setOutput("sha", head_sha);
  } catch (error) {
    setFailed(error.message);
    throw error;
  }
}

run();
