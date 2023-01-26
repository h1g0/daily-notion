import { Button, Classes, Dialog, FormGroup, InputGroup, Intent, Toaster } from "@blueprintjs/core";
import React from "react";
import { NotionHandler } from "../Data/NotionHandler";

export class AuthInput extends React.Component<{
    token: string,
    dbId: string,
    onClosed: () => void
}, {
    token: string,
    dbId: string,
    isAuthButtonEnable: boolean,
    isAuthFailed: boolean,
    isOpen: boolean,
    isLoading: boolean,
}> {

    constructor(props: any) {
        super(props);
        this.state = {
            token: this.props.token,
            dbId: this.props.dbId,
            isAuthButtonEnable: this.checkIsAuthButtonEnable(this.props.token, this.props.dbId),
            isAuthFailed: false,
            isOpen: true,
            isLoading: false,
        };
    }
    render() {
        return (
            <Dialog className="AuthInput"
                autoFocus
                enforceFocus
                usePortal
                canEscapeKeyClose={false}
                canOutsideClickClose={false}
                isCloseButtonShown={false}
                isOpen={this.state.isOpen}
                onClosed={this.props.onClosed}
                title={'Authentication Required'}
                icon={'info-sign'}
            >
                <form>
                    <div className={Classes.DIALOG_BODY}>
                        <p>
                            <strong>To use this application, authentication on Notion is required first.</strong>
                        </p>
                        <ol>
                            <li>Refer to <strong><a href="https://developers.notion.com/docs/create-a-notion-integration" target="_blank">this page</a></strong> and create an internal integration.</li>
                            <li>Enter the <strong>Integration Token</strong> and <strong>Database ID</strong> you obtained.</li>
                            <li>Press "Authenticate" button.</li>
                        </ol>
                        <FormGroup
                            label="Integration Token"
                            labelFor="token-input"
                            labelInfo="(required)"
                        >
                            <InputGroup
                                id="token-input"
                                placeholder="Integration Token"
                                value={this.state.token}
                                disabled={this.state.isLoading}
                                onChange={this.handleChangeToken}
                                intent={this.state.isAuthFailed ? Intent.DANGER : Intent.NONE}
                            />
                        </FormGroup>

                        <FormGroup
                            label="Database ID"
                            labelFor="dbid-input"
                            labelInfo="(required)"
                        >
                            <InputGroup
                                id="dbid-input"
                                placeholder="Database ID"
                                value={this.state.dbId}
                                disabled={this.state.isLoading}
                                onChange={this.handleChangeDbId}
                                intent={this.state.isAuthFailed ? Intent.DANGER : Intent.NONE}
                            />
                        </FormGroup>
                    </div>
                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button
                                id="authenticate-button"
                                intent={'primary'}
                                loading={this.state.isLoading}
                                disabled={!this.state.isAuthButtonEnable}
                                onClick={this.handleClickAuthButton}
                                type="submit"
                            >Authenticate</Button>
                        </div>
                    </div>
                </form>
            </Dialog>
        );
    }

    private handleChangeToken = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newToken = event.target.value;
        this.setState({ token: newToken });
        this.setState({ isAuthButtonEnable: this.checkIsAuthButtonEnable(newToken, this.state.dbId) });
    }

    private handleChangeDbId = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newDbId = event.target.value;
        this.setState({ dbId: newDbId });
        this.setState({ isAuthButtonEnable: this.checkIsAuthButtonEnable(this.state.token, newDbId) });
    }

    private checkIsAuthButtonEnable(token: string, dbId: string): boolean {
        return token !== '' && dbId !== '';
    }

    private handleClickAuthButton = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();

        this.setState({ isLoading: true });
        const notion = new NotionHandler(this.state.token, this.state.dbId);
        notion.verifyConnectivity().then((result) => {
            if (result.isOk) {
                this.saveTokenDbId(this.state.token, this.state.dbId);
                Toaster.create().show({
                    message: 'Authentication success!',
                    intent: 'success',
                    icon: 'tick-circle'
                });
                this.setState({ isOpen: false });
            } else {
                Toaster.create().show({
                    message: 'Authentication failed!',
                    intent: 'danger',
                    icon: 'warning-sign'
                });
                this.setState({ isAuthFailed: true });
            }
        }).finally(()=>{
            this.setState({ isLoading: false });
        });
    }

    private saveTokenDbId(token: string, dbId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('dbId', dbId);
    }
};
