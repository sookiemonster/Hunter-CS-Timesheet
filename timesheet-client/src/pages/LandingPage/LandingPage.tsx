import React, { useEffect, useState } from "react";
import './styles.css'
import User from "../../state/User";
import PeriodHeader from "../../components/PeriodHeader";
import TypeDropdown from "../../components/TypeDropdown";
import { Group } from "@mantine/core";
import { randomInt } from "crypto";


interface LandingProps {
    user:User
}

interface Point {
    x:number,
    y:number
}

// Inspired by: 
// https://codepen.io/arindam404/pen/qBLVwPd
// https://codepen.io/christinastep/pen/eXypvq

function Blob({x, y}: Point) {
    const [position, setPosition] = useState({"x": x, "y": y});
    const redrawRate = 5000; // ms

    useEffect(() => {
        const interval = setInterval(() => {
            const newPosition = {
                "x" : (Math.random()) * 80,
                "y" : (Math.random()) * 80
            }
            console.log(newPosition);
            setPosition(newPosition);
        }, redrawRate);
    
        return () => clearInterval(interval);
      }, []);

    return (
        <div style={{
            left: `${position.x}vw`,
            top: `${position.y}vh`,
        }} className="blob">
        </div>
    )
}

function LandingBackround():JSX.Element {
    const startPositions = [[0,0],[50,40], [100,100]];
    
    return (
    <div className="blob-container">
        { startPositions.map(pair => {
            return <Blob x={pair[0]} y={pair[1]} />
        })}
    </div>
    );
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
    <LandingBackround/>
    {user.isAdmin ? <LandingPageAdmin/> : <LandingPageUser/>}
    </>
}

export default LandingPage;