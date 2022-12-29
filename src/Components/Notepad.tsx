import { TextArea } from "@blueprintjs/core";
import React from "react";
import { NotionHandler } from "../Data/NotionHandler";
export class Notepad extends React.Component<{ dateStr: string }, { blockId: string, text: string }> {
    private notionHandler: NotionHandler;

    constructor(props: any) {
        super(props);
        this.state = {
            blockId: '',
            text: ''
        };

        const token = localStorage.getItem('token') ?? '';
        const dbId = localStorage.getItem('dbId') ?? '';
        this.notionHandler = new NotionHandler(token, dbId);
    }

    render() {
        return (
            <TextArea
                fill
                placeholder='some text here...'
                onChange={this.handleChange}
                className='mainText'
                style={{ height: "100%" }}
                value={this.state.text}
            />
        );
    }

    async componentDidMount() {
        console.debug(`componentDidMount`);
        await this.loadFromNotion();
    }

    private syncTimerId: number | undefined;
    private readonly syncTimerMs = 1000;

    private handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ text: event.target.value });

        if (this.syncTimerId) {
            clearTimeout(this.syncTimerId);
        }
        this.syncTimerId = window.setTimeout(() => {
            this.syncTimerId = undefined;
            Notepad.setBlockTextById(this.notionHandler, this.state.blockId, this.state.text);
        }, this.syncTimerMs);
    };

    private async loadFromNotion() {
        console.debug(`Notepad.handleLoad: ${this.props.dateStr}`);
        const getBlockIdTextResult = await Notepad.getBlockIdText(this.notionHandler, this.props.dateStr, this.props.dateStr);
        const blockId = getBlockIdTextResult.blockId ?? '';
        const text = getBlockIdTextResult.blockText ?? '';
        this.setState({
            blockId: blockId,
            text: text
        });
    }

    private static async setBlockTextById(notionHandler : NotionHandler, blockId: string, blockText: string){
        console.debug(`setBlockTextById: ${blockText}`);
        notionHandler.updateParagraphBlockByText(blockId, blockText);
    }

    private static async getBlockIdText(notionHandler: NotionHandler, title: string, dateStr: string):
        Promise<{
            isOk: boolean,
            blockId?: string,
            blockText?: string,
            lastUpdate?: Date,
        }> {
        const newTextTemplate = '';

        const getPageIdResult = await notionHandler.getPageId(title, dateStr);
        console.debug(`getPageIdResult: ${JSON.stringify(getPageIdResult)}`);
        if (!getPageIdResult.isOk) {
            return { isOk: false };
        }
        let pageId = getPageIdResult.pageId;
        if (!getPageIdResult.pageId) {
            const createPageResult = await notionHandler.createPage(title, dateStr);
            console.debug(`createPageResult: ${JSON.stringify(createPageResult)}`);
            if (!createPageResult.isOk) {
                return { isOk: false };
            }
            pageId = createPageResult.pageId;
        }
        if (!pageId) {
            return { isOk: false };
        }

        const getBlockIdTextResult = await notionHandler.getBlockIdText(pageId);
        console.debug(`getBlockIdTextResult: ${JSON.stringify(getBlockIdTextResult)}`);
        if (!getBlockIdTextResult.isOk) {
            return { isOk: false };
        }
        let blockId = getBlockIdTextResult.id;
        let blockText = getBlockIdTextResult.text;
        let lastUpdate = getBlockIdTextResult.lastUpdate
        if (!getBlockIdTextResult.id) {
            const createParagraphBlockResult = await notionHandler.createParagraphBlock(pageId, newTextTemplate);
            console.debug(`createParagraphBlockResult: ${JSON.stringify(createParagraphBlockResult)}`);
            if (!createParagraphBlockResult.isOk) {
                return { isOk: false };
            }
            blockId = createParagraphBlockResult.blockId;
            blockText = newTextTemplate;
        }

        return {
            isOk: true,
            blockId: blockId,
            blockText: blockText,
            lastUpdate: lastUpdate,
        };
    }
};
