# Branch Protection Setup

This project uses a 3-branch release flow:

- `dev`: development
- `main`: staging and preview deploys
- `prod`: production releases

Apply these rules in GitHub:

- Repo Settings -> Branches -> Add classic branch protection rule

## Rule for `prod`

- Branch name pattern: `prod`
- Require a pull request before merging: enabled
- Required approvals: `1`
- Dismiss stale approvals when new commits are pushed: enabled
- Require review from code owners: optional
- Require status checks to pass before merging: enabled
- Required status checks:
  - `Vercel Production Deploy`
- Require branches to be up to date before merging: enabled
- Require conversation resolution before merging: enabled
- Include administrators: enabled
- Allow force pushes: disabled
- Allow deletions: disabled

## Rule for `main`

- Branch name pattern: `main`
- Require a pull request before merging: enabled
- Required approvals: `1`
- Require status checks to pass before merging: enabled
- Required status checks:
  - `Vercel Preview Deploy`
- Require branches to be up to date before merging: enabled
- Require conversation resolution before merging: enabled
- Include administrators: enabled
- Allow force pushes: disabled
- Allow deletions: disabled

## Rule for `dev`

- Branch name pattern: `dev`
- Require a pull request before merging: enabled
- Required approvals: `0` (or `1` if you want stricter control)
- Require status checks to pass before merging: disabled (or enable later when test checks are added)
- Include administrators: optional
- Allow force pushes: disabled
- Allow deletions: disabled

## Default Branch

Set repository default branch to `dev`.

## Merge Flow

- Feature branches -> `dev`
- `dev` -> `main` after QA ready
- `main` -> `prod` for release

## Notes

- Keep Vercel project production branch set to `prod`.
- Preview deployments should remain Vercel internal URLs.
