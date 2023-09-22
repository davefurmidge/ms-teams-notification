export interface MessageCard {
  '@type': string
  '@context': string
  summary: string
  themeColor: string
  title: string
  sections: MessageSection[]
  potentialAction: MessageAction[]
}

export interface MessageSection {
  activityTitle: string
  activityImage: string
  activitySubtitle: string
}

export interface MessageAction {
  '@context': string
  target: string[]
  '@type': string
  name: string
}

export function createMessageCard(
  notificationSummary: string,
  notificationColor: string,
  commit: any,
  author: any,
  runNum: string,
  repoName: string,
  sha: string,
  repoUrl: string,
  timestamp: string
): MessageCard {
  const avatar_url =
    author?.avatar_url ||
    'https://www.gravatar.com/avatar/05b6d8cc7c662bf81e01b39254f88a48?d=identicon'

  const messageCard: MessageCard = {
    '@type': 'MessageCard',
    '@context': 'https://schema.org/extensions',
    summary: notificationSummary,
    themeColor: notificationColor,
    title: notificationSummary,
    sections: [
      {
        activityTitle: `**CI #${runNum} (commit ${sha.substr(
          0,
          7
        )})** on [${repoName}](${repoUrl})`,
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
  }

  return messageCard
}
