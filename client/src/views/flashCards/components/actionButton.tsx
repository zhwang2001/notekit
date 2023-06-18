import React, {JSX} from "react";
import {IconButton, Tooltip} from "@mui/material";

type ActionHandler = (index: number) => void;

interface ActionButtonProps {
    toolTipMsg: string;
    eventHandler: ActionHandler;
    children: React.ReactNode;
    index: number;
}

/**
 * @constructor
 *
 * @brief A util functional component performs some action on the flashcard
 *
 * @param {object} props the props object
 * @returns {JSX.Element} an icon button and a tooltip explaining what the button does
 */
export const ActionButton: React.FC<ActionButtonProps> = (props: ActionButtonProps): JSX.Element => {
    return (
        <Tooltip
            title={props.toolTipMsg}
            placement={"right"}
            arrow>
            <IconButton onClick={() => props.eventHandler(props.index)}>
                {props.children}
            </IconButton>
        </Tooltip>
    )
}
