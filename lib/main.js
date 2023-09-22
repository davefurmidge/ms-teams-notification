"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const rest_1 = require("@octokit/rest");
const axios_1 = __importDefault(require("axios"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const message_card_1 = require("./message-card");
const escapeMarkdownTokens = (text) => text.replace(/\n\ {1,}/g, '\n ').replace(/[_*|\-#>]/g, (match) => `\\${match}`);
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const githubToken = core.getInput('github-token', {
                required: true
            });
            const msTeamsWebhookUri = core.getInput('ms-teams-webhook-uri', {
                required: true
            });
            const notificationSummary = core.getInput('notification-summary') || 'GitHub Action Notification';
            const notificationColor = core.getInput('notification-color') || '0b93ff';
            const timezone = core.getInput('timezone') || 'UTC';
            const timestamp = (0, moment_timezone_1.default)()
                .tz(timezone)
                .format('dddd, MMMM Do YYYY, h:mm:ss a z');
            const { GITHUB_REPOSITORY, GITHUB_SHA, GITHUB_RUN_ID, GITHUB_RUN_NUMBER } = process.env;
            const [owner, repo] = (GITHUB_REPOSITORY || '').split('/');
            const sha = GITHUB_SHA || '';
            const runId = GITHUB_RUN_ID || '';
            const runNum = GITHUB_RUN_NUMBER || '';
            const params = { owner, repo, ref: sha };
            const repoName = `${params.owner}/${params.repo}`;
            const repoUrl = `https://github.com/${repoName}`;
            const octokit = new rest_1.Octokit({ auth: `token ${githubToken}` });
            const commit = yield octokit.repos.getCommit(params);
            const author = commit.data.author;
            const messageCard = yield (0, message_card_1.createMessageCard)(notificationSummary, notificationColor, commit, author, runNum, repoName, sha, repoUrl, timestamp // Remove runId from here
            );
            console.log(messageCard);
            const response = yield axios_1.default.post(msTeamsWebhookUri, messageCard);
            console.log(response);
            core.debug(response.data);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                core.setFailed(error.message);
            }
            else {
                core.setFailed('An unexpected error occurred.');
            }
        }
    });
}
run();
