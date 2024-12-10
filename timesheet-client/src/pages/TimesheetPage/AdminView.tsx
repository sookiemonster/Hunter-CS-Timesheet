import React, { useEffect, useState } from "react";
import User from "../../state/User";

import PeriodHeader from "../../components/PeriodHeader";
import { Button, Divider, Group, Space, Stack } from "@mantine/core";
import ScheduleCalendar from "../../components/Calendar";
import BoxedStat from "../../components/Stats";
import { ArrowButton, DefaultButton } from "../../components/Buttons";
import './styles/styles.css'

interface StatTextProps {
    label:string,
    text:string,
    completionState?: 'done' | 'action-needed'
}

function StatText({label,text,completionState}:StatTextProps) {
    return <div className="stat-text-container">
        <label>{label}</label>:
        <span className={`content ${completionState}`}> {text}</span>
    </div>
}

export default function TimesheetPageAdmin():JSX.Element {
    const viewedUser = "DANIEL";
    const isDefault = true;
    
    const h1 = 10;
    const h2 = 10;
    const hoursWorked = h1 + h2;
    const timestamp = new Date();

    const goToPrevious = () => {}
    const goToNext = () => {}
    const enableChanges = () => {}
    const approve = () => {}

    return (
    <div id="timesheet-container">
        <Group>
            <PeriodHeader font_size="small"/>
            <StatText label="Employee" text={viewedUser} />
        </Group>
        <Space h='xs'/>
        <div id="calendar-container">
            <ScheduleCalendar />
        </div>
        <Group className="actions-container">
            <Stack gap={0} align="flex-start">
                <StatText completionState={isDefault ? 'done' : 'action-needed'} label={"Auto-generated"} text={ isDefault ? 'Yes' : 'No'} />
                <BoxedStat variant="circle" size="small" stat={hoursWorked.toString()} label="Total Hours Worked"/>
                <Space h='md' />
                <Group>
                    <ArrowButton direction="left" onClick={() => goToPrevious()} />
                    <Button variant="outline" onClick={() => enableChanges()}>Edit</Button>
                    <DefaultButton text="Approve" onClick={() => approve()} />
                    <ArrowButton direction="right" onClick={() => goToNext()} />
                </Group>
            </Stack>
            <Divider orientation="vertical" />
            <Stack gap={2} align="flex-start">
                <StatText label="Hours (Week 1)" text={h1.toString()}/>
                <StatText label="Hours (Week 2)" text={h2.toString()}/>
                <i>{timestamp.toLocaleDateString()} {timestamp.toLocaleTimeString() }</i>
            </Stack>
        </Group>
    </div>
    )
}