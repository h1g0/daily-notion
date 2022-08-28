import { Client } from '@notionhq/client';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { SupportedFetch } from '@notionhq/client/build/src/fetch-types';
import { Body, fetch } from '@tauri-apps/api/http'

export class NotionHandler {

    private token: string;
    private dbId: string;
    private headers;

    public constructor(token: string, dbId: string) {
        this.token = token;
        this.dbId = dbId;
        this.headers = {
            'Authorization': `Bearer ${this.token}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json',
        };
    }

    public async getPageId(dateStr: string): Promise<string | undefined> {
        try {
            const query = Body.json({
                "filter": {
                    "and": [
                        {
                            "property": "title",
                            "title": {
                                "equals": dateStr
                            }
                        }
                    ]
                }
            });
            const response = await fetch<QueryDatabaseResponse>(`https://api.notion.com/v1/databases/${this.dbId}/query`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json',
                },
                body: query
            });
            console.debug(JSON.stringify(response));
            if (!response.ok) {
                console.error(`response is not ok. status: ${response.status}`);
                return undefined;
            }
            const res = response.data;
            if (res.results.length == 0) {
                return undefined;
            }
            return res.results[0].id;
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }
}
