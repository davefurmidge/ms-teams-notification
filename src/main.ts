import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';
import axios from 'axios';
import moment from 'moment-timezone';
import { createMessageCard } from './message-card';

const escapeMarkdownTokens = (text: string) =>
  text
    .replace(/\n\ {1,}/g, '\n ')
    .replace(/[_*|-#>]/g, (match) => `\\${match}`);

async function run(): Promise<void> {
  try {
    const githubToken: string = core.getInput('github-token', { required: true });
    const msTeamsWebhookUri: string = core.getInput('ms-teams-webhook-uri', {
      required: true,
    });

    const notificationSummary: string =
      core.getInput('notification-summary') || 'GitHub Action Notification';
    const notificationColor: string =
      core.getInput('notification-color') || '0b93ff';
    const timezone: string = core.getInput('timezone') || 'UTC';

    const timestamp: string = moment()
      .tz(timezone)
      .format('dddd, MMMM Do YYYY, h:mm:ss a z');

    const { GITHUB_REPOSITORY, GITHUB_SHA, GITHUB_RUN_ID, GITHUB_RUN_NUMBER } =
      process.env;
    const [owner, repo] = (GITHUB_REPOSITORY || '').split('/');
    const sha: string = GITHUB_SHA || '';
    const runId: string = GITHUB_RUN_ID || '';
    const runNum: string = GITHUB_RUN_NUMBER || '';

    const params = { owner, repo, ref: sha };
    const repoName: string = `${params.owner}/${params.repo}`;
    const repoUrl: string = `https://github.com/${repoName}`;

    const octokit = new Octokit({ auth: `token ${githubToken}` });
    const commit = await octokit.repos.getCommit(params);
    const author = commit.data.author;

    const messageCard = await createMessageCard(
      notificationSummary,
      notificationColor,
      commit,
      author,
      runNum,
      runId,
      repoName,
      sha,
      repoUrl,
      timestamp
    );

    console.log(messageCard);

    const response = await axios.post(msTeamsWebhookUri, messageCard);

    console.log(response);
    core.debug(response.data);
  } catch (error) {
    console.error(error);
    core.setFailed(error.message);
  }
}

run();
