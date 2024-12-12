import React, { useContext, useEffect, useState } from "react";

import PeriodHeader from "../../components/PeriodHeader";
import { Button, Divider, Group, Loader, LoadingOverlay, Space, Stack } from "@mantine/core";
import ScheduleCalendar from "../../components/Calendar";
import BoxedStat from "../../components/Stats";
import { ArrowButton, DefaultButton, IndicatorSymbol } from "../../components/Buttons";
import { StatText } from "./TimesheetPage";
import './styles/styles.css'

import { ControlContext } from "../../state/Control.tsx/ControlContext";
import { useFetchLocal } from "../../state/hooks";
import { User } from "../../state/User";
import { convertToCalendar } from "../../state/Schedule";
import { CalendarModificationContext } from "../../components/Calendar/CalendarModificationContext";
import { calendarToResponse } from "../../state/Schedule/Schedule";
import { useDisclosure } from '@mantine/hooks';
import {useFetchExecutable} from "../../state/hooks";

export default function TimesheetPageAdmin():JSX.Element {
    const { selectedPeriod }= useContext(ControlContext)
    const { weekOneEvents, weekTwoEvents, setWeekOneEvents, setWeekTwoEvents}= useContext(CalendarModificationContext)

    const [scheduleLoading, setScheduleLoading] = useState(true);

    const { selectedEmail } = useContext(ControlContext);
    const { data: viewedUser, restart:refetchViewedUser } = useFetchLocal<User>(`/users/getUser/${selectedEmail}`);
    // const latestSchedule = {};
    const { data:latestSchedule, restart:refetchLatest } = useFetchLocal<any>(
        `/timesheet/getDefault/${selectedEmail}/`
    );

    const { data, executeFetch:fetchApprove } = useFetchExecutable(
        `/timesheet/approve/${selectedPeriod}/${selectedEmail}/`
    )

    useEffect(() => {
        refetchViewedUser();
    }, [selectedEmail]);

    useEffect(() => {
        refetchLatest();
    }, [selectedPeriod, selectedEmail]);

    useEffect(() => {
        // No response.
        if (!latestSchedule) { return; }
        // No valid schedule returned.
        if (!latestSchedule[0]?.schedule) { 
            // setScheduleLoading(false);
            return; 
        }
        setScheduleLoading(false);
        const formatted = convertToCalendar(latestSchedule[0].schedule);
        setWeekOneEvents(formatted.Week1);
        setWeekTwoEvents(formatted.Week2);
    }, [latestSchedule]);
    
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
    const approve = () => {
        fetchApprove();
    }

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
            <LoadingOverlay visible={scheduleLoading} />
        </div>
        <Group className="actions-container">
            <Stack gap={0} align="flex-start">
                <StatText completionState={isDefault ? 'done' : 'action-needed'} label={"Auto-generated"} content={ isDefault ? 'Yes' : 'No'} />
                <BoxedStat variant="circle" size="small" stat={hoursWorked.toString()} label="Total Hours Worked"/>
                <Space h='md' />
                <Group>
                    <ArrowButton direction="left" onClick={() => goToPrevious()} />
                    {/* <Button variant="outline" onClick={() => enableChanges()}>Edit</Button> */}
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