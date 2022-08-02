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
          CF_RUNTIME_NAME: "codefresh-hosted"
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
  https://codefresh.io/csdp-docs/docs/integrations/github-actions/#codefresh-github-action-integration-arguments