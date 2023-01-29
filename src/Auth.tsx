import React from "react";
import { Navigate } from "react-router-dom";
import { AuthInput } from "./Components/AuthInput";
import { Navigation } from "./Components/Navigation";

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
        if(this.state.isAuthSucceeded){
                return(<Navigate to="/"/>);
        }

        return (
            <div className={"Auth"}>
                <Navigation 
                onDateChange={()=>{}}
                syncStatus="OK"
                />
                <AuthInput
                    token={localStorage.getItem('token') ?? ''}
                    dbId={localStorage.getItem('dbId') ?? ''}
                    onClosed={() => {
                        this.setState({isAuthSucceeded:true});
                    }} />
            </div>
        );
    }
}  