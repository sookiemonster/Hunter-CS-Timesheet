import React from "react";
import './styles.css'
import User from "../../state/User";
import PeriodHeader from "../../components/PeriodHeader";
import TypeDropdown from "../../components/TypeDropdown";


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

    
    return (
    <div id="landing-container">
        <PeriodHeader font_size="large"/>
        <TypeDropdown list={sample_list} placeholder="Employee"/>
    </div>
    )
}

function LandingPage({user}:LandingProps):JSX.Element {
    return <>
    {user.isAdmin ? <LandingPageAdmin/> : <LandingPageUser/>}
    </>
}

export default LandingPage;