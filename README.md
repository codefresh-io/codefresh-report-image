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

- name: report image
  with:
    # Name of runtime to implement the enrichment
    CF_RUNTIME_NAME: 'codefresh-hosted'

    # Codefresh API key !! Committing a plain text token is a security risk. We highly recommend using an encrypted secrets. !!
    # Documentation - https://docs.github.com/en/actions/security-guides/encrypted-secrets
    CF_API_KEY: ${{ secrets.CF_TOKEN }}

    # Image path to enrich
    CF_IMAGE: ${{ secrets.DOCKERHUB_USERNAME }}/my-image-name:tag

    # Name of Container registry integration
    CF_CONTAINER_REGISTRY_INTEGRATION: 'testghjmjhg'

    # The git branch which is related for the commit
    CF_GIT_BRANCH: '${{ github.ref_name }}'

    # GitHub Access token !! Committing a plain text token is a security risk. We highly recommend using an encrypted secrets. !!
    # Documentation - https://docs.github.com/en/actions/security-guides/encrypted-secrets
    CF_GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

    # Name of Jira integration
    CF_JIRA_INTEGRATION: 'eti-jira'

    # Jira project filter
    CF_JIRA_PROJECT_PREFIX: 'CR'

    # String starting with the issue ID to associate with image
    CF_JIRA_MESSAGE: 'CR-12293'


  uses: codefresh-io/codefresh-report-image@latest
  ```


# Complete List of Arguments
  [https://codefresh.io/csdp-docs/docs/integrations/github-actions/#codefresh-github-action-integration-arguments](https://codefresh.io/csdp-docs/docs/integrations/ci-integrations/github-actions/#github-action-codefresh-integration-arguments)
