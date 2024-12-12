import React, { useContext, useEffect, useMemo, useState } from "react";
import './styles.css'
import PeriodHeader from "../../components/PeriodHeader";
import TypeDropdown from "../../components/TypeDropdown";
import LandingBackround from "./LandingBackground";
import { Group, Loader } from "@mantine/core";
import { DefaultButton } from "../../components/Buttons";
import { User, UserContext } from "../../state/User";
import { useNavigate } from 'react-router-dom';

import LoginPage from "../LoginPage/LoginPage";
import { ControlContext } from "../../state/Control.tsx/ControlContext";
import { useFetchLocal, useModifiedFetchLocal } from "../../state/hooks";

function LandingPageUser():JSX.Element {
    const navigate = useNavigate();
    const { role, email:selfEmail } = useContext(UserContext);
    const { selectEmail, selectedPeriod } = useContext(ControlContext);

    const timestampEndpoint = { endpoint: `/timesheet/timestamp/${selectedPeriod.period_id}/${selfEmail}`}
    const { data:timestamp, loading, refetch:refetchTimestamp } = useModifiedFetchLocal<any>(timestampEndpoint) 

    // Select the email of the user to be the one viewed. 
    useEffect(() => {
        if (!selfEmail) { return; }
        selectEmail(selfEmail);
        refetchTimestamp();
    }, [selfEmail]);

    useEffect(() => {
        if (!selectedPeriod) { return; }
        refetchTimestamp();
    },[selectedPeriod])


    const hasSubmitted = useMemo(() => {
        if (loading) { return false; }
        
        if (!timestamp) { return false; }
        return timestamp[0].submitted_timestamp != null;
    }, [timestamp, selectedPeriod])

    return (
    <div id="landing-container">
        <PeriodHeader font_size="large"/>

        { (role === 'ta')
            ? <>
                <Group gap={50} style={{ paddingTop: "10px "}} align="center">
                    <DefaultButton onClick={() => navigate("/timesheets")} text={hasSubmitted ? "View" : "Submit Timesheet" } />
                    <h3 style={{ color: (hasSubmitted) ? "green" : "red"}}>
                        { loading
                            ? <Loader />
                            : <>
                            { hasSubmitted
                                ? "You've already submitted for this period."
                                : "You still need to submit for this period."
                            }
                            </>
                        }
                    </h3>
                </Group>
            </>
            : <></>
        }
    </div>
    )
}


function LandingPageAdmin():JSX.Element {
    const { role } = useContext(UserContext);
    const { selectEmail } = useContext(ControlContext);
    const { data:employee_list } = useFetchLocal<User[]>('/users/all');
    const nav = useNavigate();

    return (
    <div id="landing-container">
        <PeriodHeader font_size="large"/>
        {
            (role === 'admin')
            ? <>
            <Group className="standard-prompt">
                <h2>Select an <span className="underline">Employee</span> to get started</h2>
                { employee_list 
                    ? <TypeDropdown list={employee_list} useParam={'full_name'} onSelect={(userObj) => { selectEmail(userObj.email); nav("/timesheets"); }} placeholder="Employee"/>
                    : <Loader />
                }
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
        : (role === 'ta')
            ? <LandingPageUser/> 
            : <LandingPageAdmin/>
    }
    </div>
}

export default LandingPage;