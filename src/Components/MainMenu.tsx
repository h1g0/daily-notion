import { AnchorButton, Menu, MenuDivider } from "@blueprintjs/core";
import { MenuItem2,  Popover2 } from "@blueprintjs/popover2";
import React from "react";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";

export class MainMenu extends React.Component<
    {
    }, {
    }> {
    constructor(props: any) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Popover2
                content={this.getContent()}
                placement={"bottom"}
                interactionKind="click"
                modifiers= {{
                    arrow: { enabled: true },
                    flip: { enabled: true },
                    preventOverflow: { enabled: true },
                }}
            >
                <AnchorButton icon='menu' />
            </Popover2>
        );
    }

    getContent() {
        return (
            <Menu>
                <MenuItem2 icon="cog" text="Settings">
                    <MenuItem2 icon="key" text={"Authentication"} href="/auth"/>
                    <MenuItem2 icon="settings" text={"Preferenses"} href="/preferenses" disabled/>
                </MenuItem2>
                <MenuItem2 icon="blank" text="About" href="/about" disabled/>
                <MenuDivider />
                <MenuItem2 icon="small-cross" text="Exit" onClick={()=>{window.close()}}/>
            </Menu>
        );
    }
}  