import React from "react";
import { ActionIcon } from '@mantine/core';

interface ArrowProps {
    direction: 'left' | 'right';
    onClick?:any
    disabled?:Boolean
}

function ArrowButton({direction, onClick, disabled}:ArrowProps):JSX.Element {
    const isDisabled = (disabled) ? true : false;

    const color = "rgba(30, 23, 51, 1)"
    const right = <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>;
    const left = <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/></svg>;
    return <ActionIcon disabled={isDisabled} onClick={onClick} size={35} variant="filled" color={color} className="arrow">{ (direction == 'left') ? left : right}</ActionIcon>
}

export default ArrowButton;