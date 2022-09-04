import { TextArea } from "@blueprintjs/core";
import React from "react";
import { NotionHandler } from "../Data/NotionHandler";

export class Notepad extends React.Component<{ dateStr: string }, { blockId: string, text: string }> {
    constructor(props: any) {
        super(props);
        this.state = {
            blockId: '',
            text: ''
        };
    }

    render() {
        return (
            <TextArea
                fill
                placeholder='some text here...'
                className='mainText'
                minLength={20}
                value={this.state.text}
            />
        );
    }

    async componentDidMount() {
        console.debug(`componentDidMount`);
        await this.loadFromNotion();
    }

    private async loadFromNotion() {
        console.debug(`Notepad.handleLoad: ${this.props.dateStr}`);
        const token = localStorage.getItem('token') ?? '';
        const dbId = localStorage.getItem('dbId') ?? '';
        const getBlockIdTextResult = await Notepad.getBlockIdText(token, dbId, this.props.dateStr, this.props.dateStr);
        const blockId = getBlockIdTextResult.blockId ?? '';
        const text = getBlockIdTextResult.blockText ?? '';
        this.setState({
            blockId: blockId,
            text: text
        });
    }

    private static async getBlockIdText(token: string, dbId: string, title: string, dateStr: string):
        Promise<{
            isOk: boolean,
            blockId?: string,
            blockText?: string,
        }> {
        const notion = new NotionHandler(token, dbId);
        const newTextTemplate = '';

        const getPageIdResult = await notion.getPageId(title, dateStr);
        console.debug(`getPageIdResult: ${JSON.stringify(getPageIdResult)}`);
        if (!getPageIdResult.isOk) {
            return { isOk: false };
        }
        let pageId = getPageIdResult.pageId;
        if (!getPageIdResult.pageId) {
            const createPageResult = await notion.createPage(title, dateStr);
            console.debug(`createPageResult: ${JSON.stringify(createPageResult)}`);
            if (!createPageResult.isOk) {
                return { isOk: false };
            }
            pageId = createPageResult.pageId;
        }
        if (!pageId) {
            return { isOk: false };
        }

        const getBlockIdTextResult = await notion.getBlockIdText(pageId);
        console.debug(`getBlockIdTextResult: ${JSON.stringify(getBlockIdTextResult)}`);
        if (!getBlockIdTextResult.isOk) {
            return { isOk: false };
        }
        let blockId = getBlockIdTextResult.id;
        let blockText = getBlockIdTextResult.text;
        if (!getBlockIdTextResult.id) {
            const createParagraphBlockResult = await notion.createParagraphBlock(pageId, newTextTemplate);
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
        };
    }
};
