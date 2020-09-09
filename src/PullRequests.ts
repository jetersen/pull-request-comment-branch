import { warning } from "@actions/core";
import type { GitHub } from "@actions/github/lib/utils";

type PullRequestDetails = {
  repository: {
    pullRequest: {
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
  };
}

export async function pullRequestDetails(
  client: InstanceType<typeof GitHub>,
  owner: string,
  repo: string,
  number: number,
) {
  const {
    repository: {
      pullRequest: {
        baseRef,
        headRef,
      },
    },
  } = await client.graphql<PullRequestDetails>(
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

  return {
    base_ref: baseRef.name,
    base_sha: baseRef.target.oid,
    head_ref: headRef.name,
    head_sha: headRef.target.oid,
  };
}
