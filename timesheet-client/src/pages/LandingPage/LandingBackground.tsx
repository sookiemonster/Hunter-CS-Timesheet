import React, { useEffect, useState } from "react";
import './styles.css'

interface Point {
    x:number,
    y:number
}

// Inspired by: 
// https://codepen.io/arindam404/pen/qBLVwPd
// https://codepen.io/christinastep/pen/eXypvq

function Blob({x, y}: Point) {
    const [position, setPosition] = useState({"x": x, "y": y});
    const redrawRate = 5000; // ms, linked to the transition duration 

    useEffect(() => {
        const interval = setInterval(() => {
            const newPosition = {
                "x" : (Math.random()) * 80,
                "y" : (Math.random()) * 80
            }
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

export default function LandingBackround():JSX.Element {
    const startPositions = [[0,0],[50,40], [100,100]];
    
    return (
    <div className="blob-container">
        { startPositions.map((pair, index) => {
            return <Blob key={index} x={pair[0]} y={pair[1]} />
        })}
    </div>
    );
}