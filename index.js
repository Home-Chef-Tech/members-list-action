import { getInput, error as _error, setOutput, setFailed } from '@actions/core';
import { getOctokit } from '@actions/github';

var octokit;

const orgName = getInput('org-name');
const teamName = getInput('team-name') || null;
const authToken = process.env.GITHUB_TOKEN;
const limit = parseInt(getInput('user-limit'));

// For Testing Locally
/*
const fs = require('fs');
function get_test_values(){
    return JSON.parse(fs.readFileSync('test_data.json', { encoding: 'utf8' }));
}
var test_data = get_test_values();
const orgName = test_data['org_name'];
const orgName = test_data['team_name'];
const authToken = test_data['token'];
const path = test_data['path'];
const name = test_data['name'];
const email = test_data['email'];
const message = test_data['message']
const repoOwner = orgName;
const repoName = test_data['repo'];
*/


async function getMemberData(team){
    octokit = getOctokit(authToken);

    let resp = await octokit.teams.listMembersInOrg({
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

        allUsers = await getMemberData(teamName)

        console.log(allUsers);

        let selectedUsers = allUsers.sort(() => 0.5 - Math.random()).slice(0, limit);

        setOutput('users', selectedUsers.join(','));
    }
    catch (error) {
        setFailed(error.message);
    }
}

run();
