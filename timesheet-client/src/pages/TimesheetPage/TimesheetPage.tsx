import React, { useContext, useEffect, useState } from "react";
import User from "../../state/User/User";

import TimesheetPageAdmin from "./AdminView";
import TimesheetPageUser from "./UserView";
import { UserContext } from "../../state/User";
import { useNavigate } from "react-router-dom";
import LandingBackround from "../LandingPage/LandingBackground";

interface StatTextProps {
    label:string,
    content:string | JSX.Element,
    completionState?: 'done' | 'action-needed'
}

export function StatText({label,content,completionState}:StatTextProps) {
    return <div className="stat-text-container">
        <label>{label}</label>:
        <span className={`content ${completionState}`}> {content}</span>
    </div>
}

function TimesheetPage():JSX.Element {
    const { isAdmin, isLoggedIn } = useContext(UserContext);
    const nav = useNavigate();

    if (!isLoggedIn()) { nav("/"); }

    console.log("updating");

    return <>
    {isAdmin() ? <TimesheetPageAdmin/> : <TimesheetPageUser/>}
    </>
}

export default TimesheetPage;