# git-url-auth

GitHub Action that configures Git to authenticate access to a **specific GitHub repository** through an HTTPS URL rewrite.

The rewrite is automatically removed during the action's post-job cleanup.

## Usage

```yaml
- name: Configure Git authentication
  uses: helax-homelab-actions/git-url-auth@v1
  with:
    token: ${{ steps.app-token.outputs.token }}
    repository: helax-homelab/homelab-toolbox
```

The action configures Git to rewrite the SSH URL for the specified repository:

```text
ssh://git@github.com/helax-homelab/homelab-toolbox.git
```

to an authenticated HTTPS URL using the provided token:

```text
https://x-access-token:<token>@github.com/helax-homelab/homelab-toolbox.git
```

Only the specified repository is affected by the rewrite.

## Inputs

| Input        | Required | Description                                     |
| ------------ | -------- | ----------------------------------------------- |
| `token`      | Yes      | GitHub access token used for Git authentication |
| `repository` | Yes      | GitHub repository in `owner/name` format        |

## Cleanup

The action stores the generated Git URLs using the GitHub Actions state mechanism.

During post-job cleanup, it retrieves the exact HTTPS URL used to configure Git and removes the corresponding URL rewrite.

This means the authentication configuration does not persist between jobs on a self-hosted runner.

The token itself is not required during cleanup.

## Intended use

This action is primarily intended for self-hosted runners where Git dependencies use SSH URLs but authentication is provided through a GitHub App token.

It can be composed with [`actions/create-github-app-token`](https://github.com/actions/create-github-app-token):

```yaml
- name: Create GitHub App token
  id: app-token
  uses: actions/create-github-app-token@v3
  with:
    client-id: ${{ secrets.CLIENT_ID }}
    private-key: ${{ secrets.PRIVATE_KEY }}
    owner: helax-homelab
    repositories: homelab-toolbox
    permission-contents: read

- name: Configure Git authentication
  uses: helax-homelab-actions/git-url-auth@v1
  with:
    token: ${{ steps.app-token.outputs.token }}
    repository: helax-homelab/homelab-toolbox
```
