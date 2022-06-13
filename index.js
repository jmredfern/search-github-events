#! /usr/bin/env node
const { Octokit } = require("@octokit/core");

const { GITHUB_PERSONAL_ACCESS_TOKEN, OWNER, REPO } = process.env;

const octokit = new Octokit({
    auth: GITHUB_PERSONAL_ACCESS_TOKEN
})

const main = async () => {
    const response = await octokit.request('GET /repos/{owner}/{repo}/events', {
        owner: OWNER,
        repo: REPO
    });
    console.log(response);
}

main();

