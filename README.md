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
	  
          CF_IMAGE: ${{ secrets.DOCKERHUB_USERNAME }}/my-image-name:tag
          
          CF_GITHUB_TOKEN: ${{ secrets.GIT_TOKEN }}
	  
          #Jira issues that match
          CF_JIRA_MESSAGE: "CR-12293"
          CF_JIRA_PROJECT_PREFIX: "CR"
        uses: codefresh-io/codefresh-report-image@latest
  ```


# Complete List of Arguments
### service
- #### CF_HOST
   - **description**: Name of runtime to implement the enrichment
   - required
   - ["example",["https://codefresh.yourdoamin.com:80"]]
   - **default**: [runtime_host_url]
- #### CF_API_KEY
   - **description**: Codefresh API key
   - required
   - secret
### general
- #### CF_IMAGE
   - **description**: Image path to enrich
   - required
   - ["examples",["mydockerhub/pushedimage:fix"]]
   - **default**: [full image path here, including tag]
- #### CF_CONTAINER_REGISTRY_INTEGRATION
   - **description**: Name of Container registry integration
- #### CF_WORKFLOW_URL
   - **description**: The reported URL of the workflow that builds the image.
   - ["examples",["https://github.com/saffi-codefresh/csdp-report-image-github-action/actions/runs/2389116616"]]
   - **default**: [URL of the workflow that builds the image]
- #### CF_WORKFLOW_NAME
   - **description**: The name assigned to the workflow that builds the image. When defined, the name is displayed in the Codefresh platform.
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
   - **description**: GitHub Access token
   - required
   - ["examples",["ghp_vVvA6oh5iCO...."]]
   - secret
   - **default**: [github-personal-access-token]
- #### CF_GITHUB_API_URL
   - **description**: Specify github host api url
   - ["examples",["https://api.github.com"]]
### gitlab
- #### CF_GITLAB_TOKEN
   - **description**: When explicit authentication used: For gitlab use, authenticate with a gitlab-token
   - required
   - ["examples",["glpat-CzJ...."]]
   - secret
- #### CF_GITLAB_HOST_URL
   - **description**: Specify gitlab host url
   - ["examples",["https://gitlab.com"]]
### bitbucket
- #### CF_BITBUCKET_USERNAME
   - **description**: Bitbucket username
   - required
- #### CF_BITBUCKET_PASSWORD
   - **description**: Bitbucket password
   - required
   - secret
### bitbucketServer
- #### CF_BITBUCKET_USERNAME
   - **description**: Bitbucket server username
   - required
- #### CF_BITBUCKET_PASSWORD
   - **description**: Bitbucket server password
   - required
   - secret
- #### CF_BITBUCKET_HOST_URL
   - **description**: Bitbucket server host url
   - required
   - ["examples",["https://bitbucket-server:7990"]]
### jira
- #### CF_JIRA_INTEGRATION
   - **description**: Name of Jira integration
   - **default**: [jira-registry-integration-name]
- #### CF_JIRA_PROJECT_PREFIX
   - **description**: Jira project filter
   - required
   - ["examples",["CR"]]
   - **default**: [jira-project-prefix]
- #### CF_JIRA_MESSAGE
   - **description**: String starting with the issue ID to associate with image
   - required
   - ["examples",["fix CR-11312 "]]
   - **default**: [issue id]
- #### CF_JIRA_FAIL_ON_NOT_FOUND
   - **description**: When enabled, Fail the image report when the specified Jira issue is not found.
   - ["examples",["true"]]

