# csdp-report-image
This repository build a container image that Report created image to CSDP, for CI tools use.

## Required
* CF_API_KEY
* CF_IMAGE
* CF_HOST:  yourcluster.company.io

## Empty by Default
* CF_ENRICHERS: git, jira
  * specify enrich/integrate section to include. 
* CF_CI_TYPE: github-actions
  * specify the Calling type
  
## see field details at your installed cluster: 
* https://yourcluster.company.io/app-proxy/api/image-report
