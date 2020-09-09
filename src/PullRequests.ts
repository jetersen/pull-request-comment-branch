import { warning } from "@actions/core";
import type { GitHub } from "@actions/github/lib/utils";

type PullRequestDetails = {
  repository: {
    headRef: {
      name: string;
      target: {
        oid: string;
      };
    };
    baseRef: {
      name: string;
      target: {
        oid: string;
      };
    };
  };
}

export async function pullRequestDetails(
  client: InstanceType<typeof GitHub>,
  owner: string,
  repo: string,
  number: number,
) {
  const response = await client.graphql<PullRequestDetails>(
    `
      query pullRequestDetails($repo:String!, $owner:String!, $number:Int!) {
        repository(name: $repo, owner: $owner) {
          pullRequest(number: $number) {
            headRef {
              name
              target {
                oid
              }
            }
            baseRef {
              name
              target {
                oid
              }
            }
          }
        }
      }
    `,
    {
      owner: owner,
      repo: repo,
      number: number
    },
  );

  warning(`response: ${JSON.stringify(response, null, 2)}`);

  return {
    base_ref: response.repository.baseRef.name,
    base_sha: response.repository.baseRef.target.oid,
    head_ref: response.repository.headRef.name,
    head_sha: response.repository.headRef.target.oid,
  };
}
