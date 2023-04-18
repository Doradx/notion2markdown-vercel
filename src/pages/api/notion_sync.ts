import type { NextApiRequest, NextApiResponse } from 'next'
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
    // get event type
    const event_type = req.query.event_type as string || 'notion_sync';
    // notion
    const notion_token = process.env.NOTION_TOKEN;
    const database_id = process.env.NOTION_DATABASE_ID;
    const status_name = process.env.NOTION_STATUS_NAME || "status";
    const status_unpublished_value = process.env.NOTION_STATUS_UNPUBLISHED_VALUE || "待发布";
    // github
    const github_token = process.env.GITHUB_TOKEN as string;
    const username = process.env.GITHUB_USERNAME as string;
    const repo = process.env.GITHUB_REPO as string;
    // const event_type = process.env.GITHUB_EVENT_TYPE || 'notion_sync';
    // notion sync
    const pages_count = await axios.request({
        method: 'post',
        url: `https://api.notion.com/v1/databases/${database_id}/query`,
        headers: {
            'Authorization': `Bearer ${notion_token}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28',
        },
        data: {
            "filter": {
                "property": status_name || "status",
                "select": {
                    "equals": status_unpublished_value || "待发布"
                }
            }
        }
    })
        .then((response) => {
            console.log(response.data);
            const pages = response.data.results;
            console.log(`upublished pages: ${pages.length}`);
            if (!pages.length) {
                res.status(200).json({
                    status: 'ok',
                    message: 'no unpublished pages need to sync.'
                })
                return false;
            }
            return pages.length;
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                status: 'error',
                message: 'Notion query error, please check your token and notion dateset id. ' + error.message || 'unknown error'
            })
            return false;
        });
    if (res.headersSent) return;
    if (!pages_count) {
        res.status(200).json({
            status: 'ok',
            message: 'no unpublished pages need to sync.'
        })
    } else {
        // send github webhook
        await sendGitHubWebhook(username, repo, github_token, event_type)
            .then((response) => {
                console.log(response.data);
                return res.status(200).json({
                    status: 'ok',
                    message: 'Send github webhook successfully, please wait for synchronization.',
                    pages_count: pages_count
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

}
