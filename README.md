# csdp-report-image
This repository builds a container image that reports created image to Codefresh, for CI tools use.
Providing parameters is done by having CF_ prefixed environment variables.

## Required
* CF_API_KEY
* CF_IMAGE
* CF_HOST:  yourcluster.company.io

## Empty by Default
* CF_ENRICHERS: git, jira
  * specify enrich/integrate section to include.
* CF_CI_TYPE: github-actions
  * specify the Calling type
  
## Sections 
The environment variables are divided to sections and the use is controlled by the CF_ENRICHERS. 
For each specific connection (such as jira) parameters can be provided explicitly or by naming the integration
* either use single var CF_JIRA_INTEGRATION (provide the name) or specify all variables in explicit-jira-setup
* Bellow is the list of all the CF_ environment variables. 


### mandatory
- #### CF_IMAGE
  - **description**: Image name reported
  - required
- #### CF_CONTAINER_REGISTRY_INTEGRATION
  - **description**: Registry integration name
- #### CF_DOCKERHUB_PASSWORD
  - **description**: When no registry integration is specified: dockerhub token as password
  - ["examples",["****"]]
- #### CF_DOCKERHUB_USERNAME
  - **description**: When no registry integration is specified: dockerhub username
  - ["examples",["username"]]
- #### CF_REGISTRY_PASSWORD
  - **description**: When no registry integration is specified: registry token/password
  - ["examples",["****"]]
- #### CF_REGISTRY_USERNAME
  - **description**: When no registry integration is specified: registry username
  - ["examples",["username"]]
- #### CF_REGISTRY_DOMAIN
  - **description**: When no registry integration is specified: registry domain
  - ["examples",["quay.com"]]
- #### CF_ENRICHERS
  - **description**: List of integrations for collecting metadata on the build image
- #### CF_REGISTRY_INSECURE
  - **description**:
- #### CF_WORKFLOW_NAME
  - **description**: Given workflow name parameter.
- #### CF_WORKFLOW_URL
  - **description**: Reported url of the workflow building the image.
  - ["examples",["https://github.com/saffi-codefresh/csdp-report-image-github-action/actions/runs/2389116616"]]
- #### CF_LOGS_URL
  - **description**: Logs url
- #### CF_CI_TYPE
  - **description**: Name of integration type i.e: git-action
### git
- #### CF_GIT_BRANCH
  - **description**: The git branch which is related for the commit
- #### CF_GIT_REPO
  - **description**: The the git repository used for building the image
  - required
### explicit-git-setup
- #### CF_GIT_PROVIDER
  - **description**: The git integration type use (i.e. github)
  - required
### github
- #### CF_GITHUB_TOKEN
  - **description**: Github authentication token
  - required
  - ["examples",["ghp_vVvA6oh5iCO...."]]
- #### CF_GITHUB_API_URL
  - **description**: Specify github host api url
  - ["examples",["https://api.github.com"]]
### jira
- #### CF_JIRA_PROJECT_PREFIX
  - **description**: Jira prefix for identifying the ticket number to use
  - required
  - ["examples",["CR"]]
- #### CF_JIRA_MESSAGE
  - **description**: the message
  - required
  - ["examples",["fix CR-11312 "]]
- #### CF_JIRA_FAIL_ON_NOT_FOUND
  - **description**: Fail pipeline if 'issue' not found
- #### CF_JIRA_INTEGRATION
  - **description**: When jira integration name is specified instead of providing explicit credentials
### explicit-jira-setup
- #### CF_JIRA_API_TOKEN
  - **description**: When no jira integration is specified: Jira token for authenticating
  - required
- #### CF_JIRA_EMAIL
  - **description**: When no jira integration is specified: user email for authenticating with jira
  - required
- #### CF_JIRA_HOST_URL
  - **description**: When no jira integration is specified: The jira server url
  - required
  - ["examples",["https://codefresh-io.atlassian.net"]]
