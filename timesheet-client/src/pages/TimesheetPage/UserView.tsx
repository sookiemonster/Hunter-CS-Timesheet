import React, { useEffect, useState } from "react";
import User from "../../state/User";

import PeriodHeader from "../../components/PeriodHeader";

export default function TimesheetPageUser():JSX.Element {
    let hasSubmitted = false;

    useEffect(() => {
        // set hasSubmitted
    }, []);

    return (
    <div id="timesheet-container">
        <PeriodHeader font_size='small'/>
    </div>
    )
}
