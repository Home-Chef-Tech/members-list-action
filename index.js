import { getInput, error as _error, setOutput, setFailed } from '@actions/core';
import { getOctokit } from '@actions/github';

var octokit;

const orgName = getInput('org-name');
const teamName = getInput('team-name');
const authToken = getInput('auth-token');
const limit = parseInt(getInput('user-limit'));

// Uncomment the below, npm run build, then node dist/index.js to test locally
// const orgName = 'your org name';
// const teamName = 'your team name';
// const authToken = 'your token';
// const limit = 2;

async function getMemberData(team){
    octokit = getOctokit(authToken);

    let resp = await octokit.rest.teams.listMembersInOrg({
        'org': orgName,
        'team_slug': team,
    }).catch(
        err => {
            _error(err);
            process.exit(1);
        }
    );
    return resp.data;
}

async function run(){
    try{
        if (!authToken) {
            throw new Error('Token not found');
        }

        let allUsers = [];

        allUsers = await getMemberData(teamName);

        console.log(allUsers);

        let selectedUsers = allUsers.sort(() => 0.5 - Math.random()).slice(0, limit);

        setOutput('users', selectedUsers.map((user) => user.login).join(','));
    }
    catch (error) {
        setFailed(error.message);
    }
}

run();
