import {
    AppendBlockChildrenParameters,
    AppendBlockChildrenResponse,
    BlockObjectResponse,
    CreatePageParameters,
    CreatePageResponse,
    ListBlockChildrenResponse,
    ParagraphBlockObjectResponse,
    QueryDatabaseParameters,
    QueryDatabaseResponse,
    RichTextItemResponse,
    UpdateBlockParameters,
    UpdateBlockResponse
} from '@notionhq/client/build/src/api-endpoints';
import { Body, fetch } from '@tauri-apps/api/http';

const NOTION_VERSION = '2022-06-28';

// Have to implement by myself instead of `@notionhq/client`,
// because `fetch` in `@tauri-apps/api/http` is not compatible to `@notionhq/client`.
export class NotionHandler {

    private baseUrl: string;
    private token: string;
    private dbId: string;
    private getHeaders;
    private postHeaders;
    private patchHeaders;

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
        this.patchHeaders = {
            ...this.postHeaders,
        }
    }

    public async createPage(title: string, dateStr: string):
        Promise<{
            isOk: boolean,
            pageId?: string
        }> {

        const param: CreatePageParameters = {
            parent: {
                database_id: this.dbId,
            },
            properties: {
                "title": {
                    "title": [
                        {
                            "text": {
                                "content": title,
                            }
                        }
                    ]
                },
                "Date": {
                    "date": {
                        start: dateStr,
                    }
                }
            }
        }

        try {
            const response = await fetch<CreatePageResponse>(
                `${this.baseUrl}/pages`, {
                method: 'POST',
                headers: this.postHeaders,
                body: Body.json(param)
            });
            console.debug(JSON.stringify(response.data));
            if (!response.ok) {
                console.error(`response is not ok. status: ${response.status}`);
                return { isOk: false };
            }

            return { isOk: true, pageId: response.data.id };

        } catch (e) {
            console.error(e);
            return { isOk: false };
        }
    }

    public async getPageId(title: string, dateStr: string):
        Promise<{
            isOk: boolean,
            pageId?: string
        }> {
        const queryParam: QueryDatabaseParameters = {
            database_id: this.dbId,
            "filter": {
                "and": [
                    {
                        "property": "title",
                        "title": {
                            "equals": title
                        }
                    },
                    {
                        "property": "Date",
                        "date": {
                            "equals": dateStr
                        }
                    }
                ]
            }
        }
        //This is ugly, but I have no other idea because `QueryDatabaseBodyParameters` is not `export`.
        let bodyParam = JSON.parse(JSON.stringify(queryParam));
        delete bodyParam.database_id;
        const body = Body.json(bodyParam);
        try {
            const response = await fetch<QueryDatabaseResponse>(
                `${this.baseUrl}/databases/${this.dbId}/query`, {
                method: 'POST',
                headers: this.postHeaders,
                body: body
            });
            console.debug(JSON.stringify(response.data));
            if (!response.ok) {
                console.error(`response is not ok. status: ${response.status}`);
                return { isOk: false };
            }
            const res = response.data;
            if (res.results.length == 0) {
                return { isOk: true };
            }
            return { isOk: true, pageId: res.results[0].id };
        } catch (e) {
            console.error(e);
            return { isOk: false };
        }
    }

    public async createParagraphBlock(pageId: string, text = ''): Promise<{
        isOk: boolean,
        blockId?: string,
    }> {
        const param: AppendBlockChildrenParameters = {
            block_id: pageId,
            children: [{
                paragraph: {
                    rich_text: [{
                        text: {
                            content: text
                        }
                    }]
                }
            }]
        }

        //This is ugly, but I have no other idea because `UpdateBlockBodyRequest` is not `export`.
        let bodyParam = JSON.parse(JSON.stringify(param));
        delete bodyParam.block_id;
        const body = Body.json(bodyParam);

        try {
            const response = await fetch<AppendBlockChildrenResponse>(
                `${this.baseUrl}/blocks/${pageId}/children`, {
                method: 'PATCH',
                headers: this.patchHeaders,
                body: body,
            });
            console.debug(JSON.stringify(response.data));
            if (!response.ok) {
                console.error(`response is not ok. status: ${response.status}`);
                return { isOk: false };
            }
            return { isOk: true, blockId: response.data.results[0].id };
        } catch (e) {
            console.error(e);
            return { isOk: false };
        }
    }

    public async getBlockIdText(pageId: string):
        Promise<{
            isOk: boolean,
            id?: string,
            text?: string
        }> {
        const blockIdParagraph = await this.getBlockIdParagraph(pageId);
        return blockIdParagraph.isOk ? {
            isOk: true,
            id: blockIdParagraph.id,
            text: this.convertRichTextItemArrayToString(blockIdParagraph.textArray)
        } : { isOk: false };
    }

    private async getBlockIdParagraph(pageId: string):
        Promise<{
            isOk: boolean,
            id?: string,
            textArray?:
            Array<RichTextItemResponse>
        }> {
        try {
            const response = await fetch<ListBlockChildrenResponse>(
                `${this.baseUrl}/blocks/${pageId}/children?page_size=100`, {
                method: 'GET',
                headers: this.getHeaders,
            });
            console.debug('getBlockIdParagraph: \n' + JSON.stringify(response.data));
            if (!response.ok) {
                console.error(`response is not ok. status: ${response.status}`);
                return { isOk: false };
            }
            const res = response.data;
            for (const result of res.results) {
                if ((result as BlockObjectResponse).type === 'paragraph') {
                    return {
                        isOk: true,
                        id: result.id,
                        textArray: (result as ParagraphBlockObjectResponse)
                            .paragraph
                            .rich_text
                    };
                }
            }
            return { isOk: true };
        } catch (e) {
            console.error(e);
            return { isOk: false };
        }
    }

    private convertRichTextItemArrayToString(textArray?: Array<RichTextItemResponse>): string | undefined {
        if (!textArray) {
            return undefined;
        }
        var result = '';
        for (const text of textArray) {
            // TODO: Format to Markdown?
            result += text.plain_text;
        }
        return result;
    }

    public async updateParagraphBlockByText(blockId: string, text: string):
        Promise<{
            isOk: boolean,
            data?: UpdateBlockResponse
        }> {
        // TODO: Convert form Markdown?
        const param: UpdateBlockParameters = {
            block_id: blockId,
            paragraph: {
                rich_text: [{
                    text: {
                        content: text
                    }
                }],
            }
        };
        return this.updateParagraphBlock(param);
    }

    private async updateParagraphBlock(updateBlockParameters: UpdateBlockParameters):
        Promise<{
            isOk: boolean,
            data?: UpdateBlockResponse
        }> {
        const blockId = updateBlockParameters.block_id;
        //This is ugly, but I have no other idea because `UpdateBlockBodyRequest` is not `export`.
        let bodyParam = JSON.parse(JSON.stringify(updateBlockParameters));
        delete bodyParam.block_id;
        const body = Body.json(bodyParam);

        try {
            const response = await fetch<UpdateBlockResponse>(
                `${this.baseUrl}/blocks/${blockId}`, {
                method: 'PATCH',
                headers: this.patchHeaders,
                body: body,
            });
            console.debug(JSON.stringify(response));
            if (!response.ok) {
                console.error(`response is not ok. status: ${response.status}`);
                return { isOk: false };
            }
            return { isOk: true, data: response.data };
        } catch (e) {
            console.error(e);
            return { isOk: false };
        }
    }

}
