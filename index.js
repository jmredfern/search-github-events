#! /usr/bin/env node
const { Octokit } = require('@octokit/core');
const { inspect } = require('util');

const { GITHUB_PERSONAL_ACCESS_TOKEN, OWNER, REPO } = process.env;

const DELAY_BETWEEN_CALLS_MS = 500;
const PAGE_SIZE = 100;

const octokit = new Octokit({
    auth: GITHUB_PERSONAL_ACCESS_TOKEN
})

const getPage = (pageNumber) => {
    return octokit.request(`GET /repos/{owner}/{repo}/events?page={pageNumber}&per_page={pageSize}`, {
        owner: OWNER,
        repo: REPO,
        page: pageNumber,
        pageSize: PAGE_SIZE
    });
};

const searchPageForString = async (pageNumber, userToFind) => {
    console.log(`Searching page number ${pageNumber}...`)
    const page = await getPage(pageNumber);
    const pageText = inspect(page, { compact: true, depth: null });
    return { pageText, isStringFound: pageText.search(userToFind) !== -1 };
}

const searchNextPage = async (stringToFind, pageNumber) => {
    setTimeout(async () => {
        const { pageText, isStringFound } = await searchPageForString(pageNumber, stringToFind);
        if (isStringFound) {
            console.log(pageText);
            console.log(`\nFound string "${stringToFind}" on page ${pageNumber}, page size = ${PAGE_SIZE}`);
        } else {
            searchNextPage(stringToFind, pageNumber + 1);
        }
    }, DELAY_BETWEEN_CALLS_MS)
}

const main = async () => {
    if (process.argv.length !== 3) {
        console.log('usage: search-github-events "string to search for"');
    }
    const stringToFind = process.argv[2];
    const pageNumber = 0;

    await searchNextPage(stringToFind, pageNumber);
}

main();
