import { NonIdealState, Spinner, Card } from "@blueprintjs/core";
import React, { ChangeEvent } from "react";
import { Navigate } from "react-router-dom";
import { SyncStatus } from "../App";
import { NotionHandler } from "../Data/NotionHandler";
import MDEditor, { ContextStore } from '@uiw/react-md-editor';
import './Notepad.css';
import { CredentialHandler } from "../Data/CredentialHandler";
export class Notepad extends React.Component<{
    dateStr: string,
    onChangeStatus: (syncStatus: SyncStatus) => void,
}, {
    blockId: string,
    text: string,
    isLoading: boolean,
    isConnectivityVerified: boolean,
}> {
    private notionHandler: NotionHandler;

    constructor(props: any) {
        super(props);
        this.state = {
            blockId: '',
            text: '',
            isLoading: true,
            isConnectivityVerified: false,
        };

        const token = CredentialHandler.get('token');
        const dbId = CredentialHandler.get('dbId');
        this.notionHandler = new NotionHandler(token, dbId);
    }

    render() {
        if (!this.state.isConnectivityVerified && !this.state.isLoading) {
            return (<Navigate to="/auth" />);
        }

        if (this.state.isLoading) {
            return (
                <Card
                    className={"notepad-content"}
                >
                    <NonIdealState
                        icon={<Spinner />}
                        title={'Loading...'}
                    />
                </Card>
            );
        }



        return (
            <MDEditor
                className={"notepad-content"}
                value={this.state.text}
                id="notepad-text"
                aria-disabled={this.state.isLoading}
                onChange={this.handleChange}
                placeholder='Enter some text here...'
            />
        );
    }

    async componentDidMount() {
        console.debug(`componentDidMount`);
        let connectivity = await this.notionHandler.verifyConnectivity();
        if (connectivity.isOk) {
            this.setState({ isConnectivityVerified: true });
            this.loadFromNotion(this.props.dateStr);
        } else {
            this.setState({
                isConnectivityVerified: false,
                isLoading: false
            });
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

    private handleChange = (value?: string | undefined, event?: ChangeEvent<HTMLTextAreaElement> | undefined, state?: ContextStore | undefined) => {
        this.setState({ text: event?.target.value ? event.target.value : '' });

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
        this.setState({ isLoading: true });
        this.props.onChangeStatus('Downloading');
        const getBlockIdTextResult = await this.getBlockIdText(this.notionHandler, dateStr, dateStr);
        const blockId = getBlockIdTextResult.blockId ?? '';
        const text = getBlockIdTextResult.blockText ?? '';
        this.props.onChangeStatus(getBlockIdTextResult.isOk ? 'OK' : 'Error');
        this.setState({
            blockId: blockId,
            text: text,
            isLoading: false,
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
