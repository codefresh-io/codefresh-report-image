#!/bin/sh

echo ${GITHUB_TOKEN} | gh auth login --with-token
export TARGET_BRANCH=$(gh api graphql -f repositoryOwner="${CF_REPO_OWNER}" -f repositoryName="${CF_REPO_NAME}" -f branchName="${CF_BRANCH}" -f query='
  query getTargetBranch($repositoryOwner: String!, $repositoryName: String!, $branchName: String!) {
    organization(login: $repositoryOwner) {
      repository(name: $repositoryName) {
        defaultBranchRef {
          name
        }
        pullRequests(first: 1, headRefName: $branchName) {
          edges {
            node {
              baseRefName
            }
          }
        }
      }
    }
  }
' | jq -r '.data.organization.repository | .pullRequests.edges[0].node.baseRefName // .defaultBranchRef.name')
echo "Target Branch: ${TARGET_BRANCH}"
export TARGET_VERSION=$(git show origin/${TARGET_BRANCH}:service.yaml | yq -r ".version" -)
echo "Target Version: ${TARGET_VERSION}"
export PACKAGE_VERSION=$(if [  -f VERSION ]; then cat VERSION; else yq -r ".version" service.yaml; fi;)
echo "Package Version: ${PACKAGE_VERSION}"
semver-cli greater ${PACKAGE_VERSION} ${TARGET_VERSION}

