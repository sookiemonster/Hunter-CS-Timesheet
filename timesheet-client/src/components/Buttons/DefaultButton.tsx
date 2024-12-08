import React from "react";
import { Button } from '@mantine/core';

interface DefaultButtonProps {
    text:string
    onClick?:any
}

function DefaultButton({text, onClick}:DefaultButtonProps):JSX.Element {
    return <Button onClick={onClick} color='softpurple.4' className="submit-button">{text}</Button>
}

export default DefaultButton;