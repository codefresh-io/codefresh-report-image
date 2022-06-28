# codefresh-report-image
This image allows you to enrich images reported to Codefresh GitOps Platform. 
Using this action you are able to report an image to Codefresh and enrich it with valuable information that will be displayed in Codefresh dashboards.

### Image Metadata
* Name
* Size
* Operating System and Architecture
* Last Updated date

### Git
Commit that resulted in the image being built
* Repository + Branch
* Commit Message
* Committer

### Build
* Image Size
* Link to Job

### Jira - Associated Jira issue
* Issue ID
* Title
* Assigned to
* Status

## Example - github-actions
  ```
  - name: report image by action
        with:
          CF_HOST: "https://my-runtime-url"
          CF_API_KEY: ${{ secrets.CF_TOKEN }}
          
          #Codefresh Integrations to USE
          CF_CONTAINER_REGISTRY_INTEGRATION: "dockerhub"
          CF_JIRA_INTEGRATION: "jira"
	  
          CF_ENRICHERS: "jira, git"    
          CF_IMAGE: ${{ secrets.DOCKERHUB_USERNAME }}/my-image-name:tag
          
          CF_GITHUB_TOKEN: ${{ secrets.GIT_TOKEN }}
	  
          #Jira issues that match
          CF_JIRA_MESSAGE: "CR-12293"
          CF_JIRA_PROJECT_PREFIX: "CR"
        uses: codefresh-io/csdp-report-image@0.0.47
  ```


# Complete List of Arguments
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


### service
 - #### CF_HOST
     - **description**: The url for reaching you codefresh cluster runtime
     - required
     - ["example",["https://codefresh.yourdoamin.com:80"]]
 - #### CF_API_KEY
     - **description**: Codefresh user token - authenticating with the codefresh runtime.
     - required
### mandatory
 - #### CF_IMAGE
     - **description**: Image name reported
     - required
     - ["examples",["mydockerhub/pushedimage:fix"]]
 - #### CF_CONTAINER_REGISTRY_INTEGRATION
     - **description**: Registry integration name
 - #### CF_ENRICHERS
     - **description**: List of integrations for collecting metadata on the build image, specify blank for no integrated services, by default does both jira and git
     - ["examples",["jira, git"]]
 - #### CF_WORKFLOW_URL
     - **description**: Reported url of the workflow building the image.
     - ["examples",["https://github.com/saffi-codefresh/csdp-report-image-github-action/actions/runs/2389116616"]]
 - #### CF_WORKFLOW_NAME
     - **description**: Given workflow name parameter, Optional name to appear on codefresh platform page.
     - ["examples",["Staging build step"]]
 - #### CF_CI_TYPE
     - **description**: Name of integration type, used for filtering results by the reporting tool type
     - ["examples",["git-action","classic","jenkins",""]]
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
     - **description**: When explicit authentication used: For github use, authenticate with a github-token
     - required
     - ["examples",["ghp_vVvA6oh5iCO...."]]
 - #### CF_GITHUB_API_URL
     - **description**: Specify github host api url
     - ["examples",["https://api.github.com"]]
### gitlab
 - #### CF_GITLAB_TOKEN
     - **description**: When explicit authentication used: For gitlab use, authenticate with a gitlab-token
     - required
     - ["examples",["glpat-CzJ...."]]
 - #### GITLAB_HOST_URL
     - **description**: Specify gitlab host url
     - ["examples",["https://gitlab.com"]]
### jira
 - #### CF_JIRA_INTEGRATION
     - **description**: When jira integration name is specified instead of providing explicit credentials
 - #### CF_JIRA_PROJECT_PREFIX
     - **description**: Jira prefix for identifying the ticket number to use
     - required
     - ["examples",["CR"]]
 - #### CF_JIRA_MESSAGE
     - **description**: the message
     - required
     - ["examples",["fix CR-11312 "]]
