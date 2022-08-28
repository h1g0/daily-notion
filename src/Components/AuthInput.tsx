import { TextArea } from "@blueprintjs/core";
import React from "react";

export class Notepad extends React.Component {
    render() {
        return (
            <div className="AuthInput">
                <TextArea
                    fill
                    placeholder='some text here...'
                    className='mainText'
                    minLength={10}
                />
            </div>
        );
    }
};
