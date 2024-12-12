import "./styles.css"
import React from "react";

interface IndicatorProps {
    value:"yes" | "no";
    noImplication?:Boolean
    showValue?:Boolean
    invert?:Boolean
}

function IndicatorSymbol({value, showValue, invert, noImplication}:IndicatorProps) {
    const shouldShow = (showValue == undefined || showValue === true);
    const classes = (
        (noImplication) 
            ? "default"
            : `${value} ${invert ? 'invert' : ''}`
    )
    return <div className={`indicator ${classes}`}>{(shouldShow) ? value[0].toUpperCase() : ""}</div>
}

export default IndicatorSymbol;