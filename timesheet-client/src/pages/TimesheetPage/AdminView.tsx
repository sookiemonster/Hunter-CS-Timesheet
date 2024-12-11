import React, { useContext, useEffect, useState } from "react";

import PeriodHeader from "../../components/PeriodHeader";
import { Button, Divider, Group, Loader, Space, Stack } from "@mantine/core";
import ScheduleCalendar from "../../components/Calendar";
import BoxedStat from "../../components/Stats";
import { ArrowButton, DefaultButton, IndicatorSymbol } from "../../components/Buttons";
import { StatText } from "./TimesheetPage";
import './styles/styles.css'

import { ControlContext } from "../../state/Control.tsx/ControlContext";
import { useFetchLocal } from "../../state/hooks";
import { User } from "../../state/User";


export default function TimesheetPageAdmin():JSX.Element {
    const { selectedEmail } = useContext(ControlContext);
    const { data: viewedUser} = useFetchLocal<User>(`/users/getUser/${selectedEmail}`);
    // const latestSchedule = {};
    const { data:latestSchedule} = useFetchLocal<any>(
        `/timesheet/getDefault/${selectedEmail}/`
    );

    console.log("LATEST",latestSchedule);
    
    const isEdited = false;
    const isDefault = false;
    const isApproved = false;

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
            <StatText label="Employee" 
                content={viewedUser 
                        ? viewedUser.full_name
                        : <Loader style={{ paddingLeft: 5 }} size={18} />
                 } />
            <Divider orientation="vertical" />
            <Group gap={10}>
                <b>Edited? </b>
                <IndicatorSymbol showValue={true} value={isEdited ? 'yes' : 'no'} />
            </Group>
            <Divider orientation="vertical" />
            <Group gap={10}>
                <b>Approved? </b>
                <IndicatorSymbol showValue={true} value={isApproved ? 'yes' : 'no'} />
            </Group>
        </Group>
        <Space h='xs'/>
        <div id="calendar-container">
            <ScheduleCalendar />
        </div>
        <Group className="actions-container">
            <Stack gap={0} align="flex-start">
                <StatText completionState={isDefault ? 'done' : 'action-needed'} label={"Auto-generated"} content={ isDefault ? 'Yes' : 'No'} />
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
                <StatText label="Hours (Week 1)" content={h1.toString()}/>
                <StatText label="Hours (Week 2)" content={h2.toString()}/>
                <i>{timestamp.toLocaleDateString()} {timestamp.toLocaleTimeString() }</i>
            </Stack>
        </Group>
    </div>
    )
}