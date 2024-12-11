import "./styles.css"
import React from "react";

interface IndicatorProps {
    value:"yes" | "no";
    showValue?:Boolean
    invert?:Boolean
}

function IndicatorSymbol({value, showValue, invert}:IndicatorProps) {
    const shouldShow = (showValue == undefined || showValue === true);
    return <div className={`indicator ${value} ${invert ? 'invert' : ''}`}>{(shouldShow) ? value[0].toUpperCase() : ""}</div>
}

export default IndicatorSymbol;