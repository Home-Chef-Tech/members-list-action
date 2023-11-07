# Members-List-Actions

The members-list-actions is a GitHub Action that generates a list of all the members in an organization.
Adding this action to your organization will generate a JSON file that updates itself each time a new member is added to the organization.

## Getting Started

Create a `main.yml` file inside `.github/workflows/` and add the following.

```YAML
on:
  workflow_dispatch:
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
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    - name: Use the comma-separated list
        uses: some/other-action@main
        users: ${{steps.user-list.outputs.users}}
```

Don't forget to change the organization name.

## Parameters

<center>

OPTION            | DEFAULT | DESCRIPTION             | REQUIRED
----------------- | ------- | ----------------------- | -------------
org-name          |         | Organization Name       | true
team-name         |         | Team Name to pull from  | true
user-limit        | 2       | Max users to select     | false

</center>

## License
This project is licensed under the GNU GENERAL PUBLIC LICENSE - see the [LICENSE] file for details.

[LICENSE]: https://github.com/homechef/members-list-action/blob/main/LICENSE

Forked from https://github.com/RITct/members-list-action
