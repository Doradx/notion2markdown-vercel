import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

function sendGitHubWebhook(username: string, repo: string, token: string, event_type: string = 'notion_sync') {
    return axios.request({
        method: 'post',
        url: `https://api.github.com/repos/${username}/${repo}/dispatches`,
        headers: {
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: {
            "event_type": event_type
        }
    });
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const event_type = req.query.event_type as string || 'deploy';
    // github
    const github_token = process.env.GITHUB_TOKEN as string;
    const username = process.env.GITHUB_USERNAME as string;
    const repo = process.env.GITHUB_REPO as string;
    sendGitHubWebhook(username, repo, github_token, event_type)
        .then((response) => {
            console.log(response.data);
            return res.status(200).json({
                status: 'ok',
                message: 'Send github webhook successfully, please wait for synchronization.',
            })
        })
        .catch((error) => {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: 'Send github webhook error, please check your setting of github username, repo and token. ' + error.message || 'unknown error'
            })
        });
}
