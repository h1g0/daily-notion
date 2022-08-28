import { TextArea } from "@blueprintjs/core";
import React from "react";

export class Notepad extends React.Component<any, { value: string }> {
    constructor(props: any) {
        super(props);
        this.state = {
            value: ''
        };
        this.onLoad.bind(this);
    }


    render() {
        return (
            <div className="Notepad">
                <TextArea
                    fill
                    placeholder='some text here...'
                    className='mainText'
                    minLength={10}
                    onLoad={this.onLoad}
                    value={this.state.value}
                />
            </div>
        );
    }

    async onLoad() {
    }
};
