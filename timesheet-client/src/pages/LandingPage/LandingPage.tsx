import React from "react";
import './styles.css'
import User from "../../state/User";
import PeriodHeader from "../../components/PeriodHeader";
import TypeDropdown from "../../components/TypeDropdown";
import { Group, Stack } from "@mantine/core";


interface LandingProps {
    user:User;
}

function LandingPageUser():JSX.Element {
    
    return (
    <div id="landing-container">
        
    </div>
    )
}


function LandingPageAdmin():JSX.Element {

    const sample_list = Array.from({length: 10}, (v, k) => `employee ${k+1}`); 

    const foo = (s:string) => {
        console.log(s);
    }
    
    return (
    <div id="landing-container">
        <PeriodHeader font_size="large"/>
        <Group className="standard-prompt">
            <h2>Select an <span className="underline">Employee</span> to get started</h2>
            <TypeDropdown list={sample_list} onSelect={foo} placeholder="Employee"/>

        </Group>
        <span className="alternate-prompt">
            or <a href="/timesheets">view all timesheets submitted for this period</a>
        </span>
    </div>
    )
}

function LandingPage({user}:LandingProps):JSX.Element {
    return <>
    {user.isAdmin ? <LandingPageAdmin/> : <LandingPageUser/>}
    </>
}

export default LandingPage;