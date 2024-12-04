import React from "react";
import './styles.css'
import User from "../../state/User";
import PeriodHeader from "../../components/PeriodHeader";

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
    
    return (
    <div id="landing-container">
        <PeriodHeader font_size="large"/>
    </div>
    )
}

function LandingPage({user}:LandingProps):JSX.Element {
    return <>
    {user.isAdmin ? <LandingPageAdmin/> : <LandingPageUser/>}
    </>
}

export default LandingPage;