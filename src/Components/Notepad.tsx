import { TextArea, NonIdealState, Spinner } from "@blueprintjs/core";
import React from "react";
import { SyncStatus } from "../App";
import { NotionHandler } from "../Data/NotionHandler";
import { AuthInput } from "./AuthInput";

export class Notepad extends React.Component<{
    dateStr: string,
    onChangeStatus: (syncStatus: SyncStatus) => void,
}, {
    blockId: string,
    text: string,
    isEnable: boolean,
    isConnectivityVerified: boolean,
}> {
    private notionHandler: NotionHandler;

    constructor(props: any) {
        super(props);
        this.state = {
            blockId: '',
            text: '',
            isEnable: false,
            isConnectivityVerified: false,
        };

        const token = localStorage.getItem('token') ?? '';
        const dbId = localStorage.getItem('dbId') ?? '';
        this.notionHandler = new NotionHandler(token, dbId);
    }

    render() {
        if (!this.state.isEnable) {
            return (
                <NonIdealState
                    icon={<Spinner />}
                    title={'Loading...'}
                />);
        }

        if (!this.state.isConnectivityVerified) {
            return (
                <AuthInput
                    token={localStorage.getItem('token') ?? ''}
                    dbId={localStorage.getItem('dbId') ?? ''}
                    onClosed={() => {
                        this.setState({ isConnectivityVerified: true });
                        this.notionHandler = new NotionHandler(localStorage.getItem('token') ?? '', localStorage.getItem('dbId') ?? '');
                        this.loadFromNotion(this.props.dateStr);
                    }}
                />
            );
        }

        return (
            <TextArea
                fill
                placeholder='Enter some text here...'
                onChange={this.handleChange}
                className={'mainText'}
                style={{ height: "100%" }}
                value={this.state.text}
            />
        );
    }

    async componentDidMount() {
        console.debug(`componentDidMount`);
        if (await this.notionHandler.verifyConnect()) {
            this.setState({ isConnectivityVerified: true });
            this.loadFromNotion(this.props.dateStr);
        }
    }

    shouldComponentUpdate(nextProps: any) {
        if (this.props.dateStr !== nextProps.dateStr) {
            this.loadFromNotion(nextProps.dateStr);
        }
        return true;
    }

    private syncTimerId: number | undefined;
    private readonly syncTimerMs = 500;

    private handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ text: event.target.value });

        if (this.syncTimerId) {
            clearTimeout(this.syncTimerId);
        }
        this.syncTimerId = window.setTimeout(() => {
            this.syncTimerId = undefined;
            this.setBlockTextById(this.notionHandler, this.state.blockId, this.state.text);
        }, this.syncTimerMs);
    };

    private async loadFromNotion(dateStr: string) {
        console.debug(`Notepad.handleLoad: ${dateStr}`);
        this.setState({ isEnable: false });
        this.props.onChangeStatus('Downloading');
        const getBlockIdTextResult = await this.getBlockIdText(this.notionHandler, dateStr, dateStr);
        const blockId = getBlockIdTextResult.blockId ?? '';
        const text = getBlockIdTextResult.blockText ?? '';
        this.props.onChangeStatus(getBlockIdTextResult.isOk ? 'OK' : 'Error');
        this.setState({
            blockId: blockId,
            text: text,
            isEnable: true,
        });
    }

    private async setBlockTextById(notionHandler: NotionHandler, blockId: string, blockText: string) {
        this.props.onChangeStatus('Uploading');
        const updateBlockResult = await notionHandler.updateParagraphBlockByText(blockId, blockText);
        this.props.onChangeStatus(updateBlockResult.isOk ? 'OK' : 'Error');
    }

    private async getBlockIdText(notionHandler: NotionHandler, title: string, dateStr: string):
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
