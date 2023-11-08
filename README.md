# Members-List-Actions

The members-list-actions is a GitHub Action that generates a list of a limited number of random users in an organization's team
Adding this action will allow you to randomly choose a number of users and then use the output in another action

## Getting Started

Example usage:

```YAML
jobs:
  runs-on: ubuntu-latest
  name: Action to fetch 2 random users
  steps:
    - name: Member List
      id: list-members
      uses: homechef/members-list-action@main
      with:
        org-name: Your-Org-Name
        team-name: devs
        user-limit: 2 # optional : default 2
        auth-token: ${{secrets.YOUR_AUTH_TOKEN}}
    - name: Use the comma-separated list
        uses: some/other-action@main
        users: ${{steps.user-list.outputs.users}}
```

## Parameters

<center>

OPTION            | DEFAULT | DESCRIPTION                          | REQUIRED
----------------- | ------- | ------------------------------------ | ----------
org-name          |         | Organization Name                    | true
team-name         |         | Team Name to pull from               | true
auth-token        |         | Max users to select                  | true
user-limit        | 2       | auth token with read:org permissions | false

</center>

## Development Setup

```
nvm install 20
nvm use 20
```

Before committing, make sure to build your action to see changes

```
npm run build
```

The action will fail on linting errors. Check before committing with:
```
npm run test
```


## License
This project is licensed under the GNU GENERAL PUBLIC LICENSE - see the [LICENSE] file for details.

[LICENSE]: https://github.com/homechef/members-list-action/blob/main/LICENSE

Forked from https://github.com/RITct/members-list-action
