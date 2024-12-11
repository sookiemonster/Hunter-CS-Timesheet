import React, { useEffect, useState } from "react";
import './styles.css'
import User from "../../state/User/User";
import PeriodHeader from "../../components/PeriodHeader";
import TypeDropdown from "../../components/TypeDropdown";
import LandingBackround from "./LandingBackground";
import { Group, Indicator } from "@mantine/core";
import { DefaultButton, IndicatorSymbol } from "../../components/Buttons";

interface LandingProps {
    user:User
}


function LandingPageUser():JSX.Element {
    let hasSubmitted = false;

    const redirect = () => console.log("redirect");

    useEffect(() => {
        // set hasSubmitted
    }, []);

    return (
    <div id="landing-container">
        <PeriodHeader font_size="large"/>
        <Group gap={50} style={{ paddingTop: "10px "}} align="center">
            <DefaultButton onClick={() => redirect()} text={hasSubmitted ? "Edit" : "Submit" } />
            <h3 style={{ color: (hasSubmitted) ? "green" : "red"}}>
                { hasSubmitted
                    ? "You've already submitted for this period."
                    : "You still need to submit for this period."
                }
            </h3>
            <IndicatorSymbol value={hasSubmitted ? "yes" : "no"}/>
        </Group>
    </div>
    )
}


function LandingPageAdmin():JSX.Element {
    let all_employees = Array.from({length: 10}, (v, k) => `employee ${k+1}`); 

    useEffect(() => {
        // set all employees
    }, []);

    const foo = (s:string) => {
        console.log(s);
    }
    
    return (
    <div id="landing-container">
        <PeriodHeader font_size="large"/>
        <Group className="standard-prompt">
            <h2>Select an <span className="underline">Employee</span> to get started</h2>
            <TypeDropdown list={all_employees} onSelect={foo} placeholder="Employee"/>
        </Group>
        <span className="alternate-prompt">
            or <a href="/timesheets">view all timesheets submitted for this period</a>
        </span>
    </div>
    )
}

function LandingPage({user}:LandingProps):JSX.Element {
    return <>
    <LandingBackround/>
    {user.isAdmin ? <LandingPageAdmin/> : <LandingPageUser/>}
    </>
}

export default LandingPage;