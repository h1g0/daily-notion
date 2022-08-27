import { Button, TextArea } from "@blueprintjs/core";
import React from "react";

export interface NotepadProps { }

export const Notepad: React.FC<NotepadProps> = () => {
    return (
        <div className="Notepad">
            <TextArea
                fill
                placeholder='some text here...'
                className='mainText'
                minLength={10}
            />
        </div>
    );
};
