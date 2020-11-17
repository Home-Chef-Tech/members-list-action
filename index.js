const core = require('@actions/core');
const github = require('@actions/github');
fs = require('fs');

var octokit;

const orgName = core.getInput('org-name');
const authToken = process.env["GITHUB_TOKEN"];
const path = core.getInput("file-path");
const name = core.getInput("commit-user-name");
const email = core.getInput("commit-user-email");
const message = core.getInput("commit-msg")
// Eliminate Owner name from repo;
const repo = process.env["GITHUB_REPOSITORY"].split("/")[1]

/*
// For Testing Locally

function get_test_values(){
    return JSON.parse(fs.readFileSync('test_data.json', { encoding: 'utf8' }));
}
var test_data = get_test_values();
const orgName = test_data["org_name"]
const authToken = test_data["token"];
const path = test_data["path"]
const name = test_data["name"]
const email = test_data["email"]
const message = test_data["message"]
const repo = test_data["repo"]
*/


async function getMemberData(teams){
    // TODO: find async forEach alternative
    member_data = {};
    for(var i=0; i < teams.length; i++){
        var resp = await octokit.teams.listMembersInOrg({
            org: orgName,
            team_slug: teams[i].slug,
        });
        member_data[teams[i].name] = resp.data
    }
    return member_data;
}

async function run(){
    try{       
        if (!authToken) {
            throw new Error("Token not found");
        }

        octokit = github.getOctokit(authToken);

        teams_response =  await octokit.teams.list({
            org: orgName,
        }).catch(
            err => console.log(err)
        );
        
        member_data = await getMemberData(teams_response.data);
        
        json_file_response = await octokit.repos.getContent({
            owner: orgName,
            repo: repo,
            path: path,
        }).catch(
            err => console.log(err)
        );
        
        // github transfers files in base64
        prevContent = Buffer.from(json_file_response.data.content, "base64").toString("ascii");
        content = JSON.stringify(member_data);
        base64String = Buffer.from(content).toString("base64");

        if(prevContent != content){
            await octokit.repos.createOrUpdateFileContents({
                owner: orgName,
                repo: repo,
                message: message,
                content: base64String,
                path: path,
                sha: json_file_response.data.sha,
                committer: {
                    name: name,
                    email: email
                }
            })
            .then(  
                core.setOutput("message", "File Updated"), console.log("file updated")
            )
            .catch(
                err => console.log(err)
            );
        }
        else{
            core.setOutput("message", "No Changes Detected");
            console.log("no changes");
        }
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

run();