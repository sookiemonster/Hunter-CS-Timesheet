import React from "react";
import { Button } from '@mantine/core';

interface ApproveButtonProps {
    onClick?:any
}

function SubmitButton({onClick}:ApproveButtonProps):JSX.Element {
    return <Button onClick={onClick} color='softpurple.4' className="submit-button">Submit</Button>
}

export default SubmitButton;