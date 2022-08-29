import { BlockObjectResponse, ListBlockChildrenResponse, ParagraphBlockObjectResponse, QueryDatabaseResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';
import { Body, fetch } from '@tauri-apps/api/http'

const NOTION_VERSION = '2022-06-28';

export class NotionHandler {

    private baseUrl: string;
    private token: string;
    private dbId: string;
    private getHeaders;
    private postHeaders;

    public constructor(token: string, dbId: string) {
        this.baseUrl = 'https://api.notion.com/v1';
        this.token = token;
        this.dbId = dbId;
        const headers = {
            'Authorization': `Bearer ${this.token}`,
            'Notion-Version': NOTION_VERSION,
        };
        this.getHeaders = {
            ...headers,
        }
        this.postHeaders = {
            ...headers,
            'Content-Type': 'application/json',
        }
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
            const response = await fetch<QueryDatabaseResponse>(
                `${this.baseUrl}/databases/${this.dbId}/query`, {
                method: 'POST',
                headers: this.postHeaders,
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

    public async getBlockIdText(pageId: string): Promise<{ id: string, text: string } | undefined> {
        const blockIdParagraph = await this.getBlockIdParagraph(pageId);
        return blockIdParagraph ? {
            id: blockIdParagraph.id,
            text: this.convertRichTextItemArrayToString(blockIdParagraph.textArray)
        } : undefined;
    }

    private async getBlockIdParagraph(pageId: string): Promise<{ id: string; textArray: Array<RichTextItemResponse>; } | undefined> {
        try {
            const response = await fetch<ListBlockChildrenResponse>(
                `${this.baseUrl}/blocks/${pageId}/children?page_size=100`, {
                method: 'GET',
                headers: this.getHeaders,
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
            //return {id: res.results[0].id, content: res.results[0].object.toString()};
            for (const result of res.results) {
                if ((result as BlockObjectResponse).type === 'paragraph') {
                    return {
                        id: result.id,
                        textArray: (result as ParagraphBlockObjectResponse)
                            .paragraph
                            .rich_text
                    };
                }
            }
            return undefined;
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    private convertRichTextItemArrayToString(textArray: Array<RichTextItemResponse>): string {
        var result = '';
        for (const text of textArray) {
            // TODO: Formatting to Markdown?
            result += text.plain_text;
        }
        return result;
    }
}
