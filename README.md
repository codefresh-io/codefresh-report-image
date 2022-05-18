# csdp-report-image
Report created image to CSDP, for CI tools use.
##Required
* CF_API_KEY
* CF_IMAGE
## Required with Default
* CF_HOST:  app-proxy.yourcluster.io:8080
  * default: g.codefresh.io
* CF_ENRICHERS: git, jira
  * default is empty
  * possible values several of: git, jira
## Optional
* CF_CONTAINER_REGISTRY_INTEGRATION: "quay-1"
  * default : empty would take the default    
* CF_INSECURE: true
  * default: false
* CF_WORKFLOW_URL:
* CF_LOGS_URL:
### Optional section Git - specify if included in CF_ENRICHERS list
* CF_GIT_BRANCH:
* CF_GIT_SHA: 
* CF_GIT_REPO:
* CF_GIT_INTEGRATION:
### optional section Jira - specify if included in CF_ENRICHERS list                                                         
* CF_JIRA_PROJECT_PREFIX: "CR"
* CF_JIRA_MESSAGE: "${{ GIT_BRANCH }}"
* CF_JIRA_INTEGRATION: "jira-1"
* CF_JIRA_FAIL_ON_NOT_FOUND : ""

...
