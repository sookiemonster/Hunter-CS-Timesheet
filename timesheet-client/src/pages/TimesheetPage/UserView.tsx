import React, { useEffect, useState } from "react";
import User from "../../state/User/User";

import PeriodHeader from "../../components/PeriodHeader";
import { Button, Divider, Group, Space, Stack } from "@mantine/core";
import ScheduleCalendar from "../../components/Calendar";
import BoxedStat from "../../components/Stats";
import { ArrowButton, DefaultButton, IndicatorSymbol } from "../../components/Buttons";
import { StatText } from "./TimesheetPage";
import './styles/styles.css'


export default function TimesheetPageAdmin():JSX.Element {
    const viewedUser = "DANIEL";
    const isDefault = true;
    const isEdited = true;
    const isApproved = false;
    
    const h1 = 10;
    const h2 = 10;
    const hoursWorked = h1 + h2;
    const timestamp = new Date();

    const revert = () => {}
    const submit = () => {}

    return (
    <div id="timesheet-container">
        <Group>
            <PeriodHeader font_size="small"/>
            <StatText label="Employee" content={viewedUser} />
            <Divider orientation="vertical" />
            <Group gap={10}>
                <b>Edited by admin? </b>
                <IndicatorSymbol invert={true} showValue={true} value={isEdited ? 'yes' : 'no'} />
            </Group>
            <Divider orientation="vertical" />
            
        </Group>
        <Space h='md'/>
        <div id="calendar-container">
            <ScheduleCalendar />
        </div>
        <Group className="actions-container">
            <Stack gap={0} align="flex-start">
                <StatText completionState={isDefault ? 'done' : 'action-needed'} label={"Differs from default"} content={ isDefault ? 'No' : 'Yes'} />
                <StatText completionState={isApproved ? 'done' : 'action-needed'} label={"Approved"} content={ isApproved ? 'Yes' : 'No'} />
                <BoxedStat variant="circle" size="small" stat={hoursWorked.toString()} label="Total Hours Worked"/>
                <Space h='md' />
                <Group>
                    <Button variant="outline" onClick={() => revert()}>Discard</Button>
                    <DefaultButton text="Submit" onClick={() => submit()} />
                </Group>
            </Stack>
            <Divider orientation="vertical" />
            <Stack gap={2} align="flex-start">
                <StatText label="Hours (Week 1)" content={h1.toString()}/>
                <StatText label="Hours (Week 2)" content={h2.toString()}/>
                <i>{ timestamp ? "Submitted: " : "" }{timestamp.toLocaleDateString()} {timestamp.toLocaleTimeString() }</i>
            </Stack>
        </Group>
    </div>
    )
}