"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessageCard = void 0;
function createMessageCard(notificationSummary, notificationColor, commit, author, runNum, repoName, sha, repoUrl, timestamp) {
    const avatar_url = (author === null || author === void 0 ? void 0 : author.avatar_url) ||
        'https://www.gravatar.com/avatar/05b6d8cc7c662bf81e01b39254f88a48?d=identicon';
    const messageCard = {
        '@type': 'MessageCard',
        '@context': 'https://schema.org/extensions',
        summary: notificationSummary,
        themeColor: notificationColor,
        title: notificationSummary,
        sections: [
            {
                activityTitle: `**CI #${runNum} (commit ${sha.substr(0, 7)})** on [${repoName}](${repoUrl})`,
                activityImage: avatar_url,
                activitySubtitle: `by ${commit.data.commit.author.name} [(@${author.login})](${author.html_url}) on ${timestamp}`
            }
        ],
        potentialAction: [
            {
                '@context': 'http://schema.org',
                target: [`${repoUrl}/actions/runs`],
                '@type': 'ViewAction',
                name: 'View Workflow Runs'
            },
            {
                '@context': 'http://schema.org',
                target: [commit.data.html_url],
                '@type': 'ViewAction',
                name: 'View Commit Changes'
            }
        ]
    };
    return messageCard;
}
exports.createMessageCard = createMessageCard;
