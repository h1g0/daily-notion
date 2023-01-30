import React from "react";
import { Navigate } from "react-router-dom";
import { AuthInput } from "./Components/AuthInput";
import { Navigation } from "./Components/Navigation";
import { CredentialHandler } from "./Data/CredentialHandler";
import './App.css';
export class Auth extends React.Component<any, {
    isAuthSucceeded: boolean,
}> {
    constructor(props: any) {
        super(props);
        this.state = {
            isAuthSucceeded: false,
        };
    }

    render() {
        if (this.state.isAuthSucceeded) {
            return (<Navigate to="/" />);
        }
        return (
            <div className={"app"}>
                <Navigation
                    onDateChange={() => { }}
                    syncStatus="OK"
                />
                <AuthInput
                    token={CredentialHandler.get('token')}
                    dbId={CredentialHandler.get('dbId')}
                    onClosed={() => {
                        this.setState({ isAuthSucceeded: true });
                    }} />
            </div>
        );
    }
}  