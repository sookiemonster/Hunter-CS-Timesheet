import React, { useEffect, useState } from "react";
import User from "../../state/User";

import TimesheetPageAdmin from "./AdminView";
import TimesheetPageUser from "./UserView";

interface TimesheetPageProps {
    user:User
}

interface StatTextProps {
    label:string,
    text:string,
    completionState?: 'done' | 'action-needed'
}

export function StatText({label,text,completionState}:StatTextProps) {
    return <div className="stat-text-container">
        <label>{label}</label>:
        <span className={`content ${completionState}`}> {text}</span>
    </div>
}

function TimesheetPage({user}:TimesheetPageProps):JSX.Element {
    return <>
    {user.isAdmin ? <TimesheetPageAdmin/> : <TimesheetPageUser/>}
    </>
}

export default TimesheetPage;