import "./styles.css"
import React from "react";

interface IndicatorProps {
    value:"yes" | "no";
    showValue?:Boolean
}

function IndicatorSymbol({value, showValue}:IndicatorProps) {
    const shouldShow = (showValue == undefined || showValue === true);
    return <div className={`indicator ${value}`}>{(shouldShow) ? value[0].toUpperCase() : ""}</div>
}

export default IndicatorSymbol;