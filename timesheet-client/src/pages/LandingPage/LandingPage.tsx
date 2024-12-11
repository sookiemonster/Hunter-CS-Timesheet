import React, { useContext, useEffect, useState } from "react";
import './styles.css'
import PeriodHeader from "../../components/PeriodHeader";
import TypeDropdown from "../../components/TypeDropdown";
import LandingBackround from "./LandingBackground";
import { Group, Indicator } from "@mantine/core";
import { DefaultButton, IndicatorSymbol } from "../../components/Buttons";
import { UserContext } from "../../state/User";
import { useNavigate, Link } from 'react-router-dom';

import LoginPage from "../LoginPage/LoginPage";
import Navbar from "../../components/Navbar";

function LandingPageUser():JSX.Element {
    const { role } = useContext(UserContext);
    let hasSubmitted = false;

    const redirect = () => console.log("redirect");

    useEffect(() => {
        // set hasSubmitted
    }, []);

    return (
    <div id="landing-container">
        <PeriodHeader font_size="large"/>

        { (role === 'ta')
            ? <>
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
            </>
            : <></>
        }
    </div>
    )
}


function LandingPageAdmin():JSX.Element {
    const { role } = useContext(UserContext);

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
        {
            (role === 'admin')
            ? <>
            <Group className="standard-prompt">
                <h2>Select an <span className="underline">Employee</span> to get started</h2>
                <TypeDropdown list={all_employees} onSelect={foo} placeholder="Employee"/>
            </Group>
            <span className="alternate-prompt">
                or <a href="/timesheets">view all timesheets submitted for this period</a>
            </span>
            </>
            : <></>
        }
    </div>
    )
}

function LandingPage():JSX.Element {
    const { loginStatus, role } = useContext(UserContext);

    return <div>
    <LandingBackround/>
    { (!loginStatus) 
        ? <LoginPage />
        : <>
            <Navbar initial_active={0} ></Navbar>
            {
                (role === 'ta')
                    ? <LandingPageUser/> 
                    : <LandingPageAdmin/>
            }
        </>
    }
    </div>
}

export default LandingPage;