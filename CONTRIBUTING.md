# Contributing

## Branching strategy

`develop` is the active integration branch — all work branches off it and merges back into
it. `main` stays on the last submitted/released state and only receives a merge from
`develop` at a milestone (end of term), not on every change.

Branch naming: `<type>/<short-description>`, off the latest `develop`.

| Type | Use it for |
|---|---|
| `feat/` | a new capability |
| `fix/` | a bug fix |
| `chore/` | tooling, config — nothing user-facing |
| `docs/` | documentation only |

Keep a branch focused on one card and open a pull request back into `develop` as soon as
there is something reviewable.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/): `type(scope): summary`, written in
English, imperative mood, under ~72 characters for the summary line.

## Pull requests

- Link the PR to its Trello card in the description.
- Describe what changed and why.
- CI (lint + build) must pass before merge.
- At least one team member must approve before merge.

## Task tracking

Every card on the [Trello board](https://trello.com/b/oeAHpSaq/software) moves through
`Sprint Backlog → In Progress → Review/Testing → Done` as work on it progresses. Link the
related PR on the card once one exists.
