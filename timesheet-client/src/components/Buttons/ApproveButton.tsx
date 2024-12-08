import React from "react";
import { Button } from '@mantine/core';

interface ApproveButtonProps {
    onClick?:any
}

function ApproveButton({onClick}:ApproveButtonProps):JSX.Element {
    return <Button onClick={onClick} color='softpurple.4' className="approve-button">Approve</Button>
}

export default ApproveButton;