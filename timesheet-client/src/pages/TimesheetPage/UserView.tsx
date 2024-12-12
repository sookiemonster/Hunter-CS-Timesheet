import React, { useContext, useEffect, useState } from "react";
import User from "../../state/User/User";

import PeriodHeader from "../../components/PeriodHeader";
import { Button, Divider, Group, Space, Stack, Loader } from "@mantine/core";
import ScheduleCalendar from "../../components/Calendar";
import BoxedStat from "../../components/Stats";
import { ArrowButton, DefaultButton, IndicatorSymbol } from "../../components/Buttons";
import { StatText } from "./TimesheetPage";
import './styles/styles.css'


import { ControlContext } from "../../state/Control.tsx/ControlContext";
import { convertToCalendar } from "../../state/Schedule";
import { CalendarModificationContext } from "../../components/Calendar/CalendarModificationContext";
import { calendarToResponse } from "../../state/Schedule/Schedule";
import { useModifiedFetchLocal} from "../../state/hooks";
import { fetchLocal, fetchLocalWithBody } from "../../state/Util";

export default function TimesheetPageUser():JSX.Element {
    const { selectedPeriod }= useContext(ControlContext)
    const { weekOneEvents, weekTwoEvents, isEdited, setIsEdited, weekOneHours, weekTwoHours, setWeekOneEvents, setWeekTwoEvents}= useContext(CalendarModificationContext)

    const [scheduleLoading, setScheduleLoading] = useState(true);

    const { selectedEmail } = useContext(ControlContext);

    const userEndpoint = { endpoint: `/users/getUser/${selectedEmail}` }
    const { data: viewedUser, restart:refetchViewedUser } = useModifiedFetchLocal<User>(userEndpoint);
    
    const latestEndpoint = { endpoint: `/timesheet/getLatest/${selectedPeriod.period_id}/${selectedEmail}/` }
    const { data:latestSchedule, restart:refetchLatest } = useModifiedFetchLocal<any>(latestEndpoint);

    const defaultEndpoint = { endpoint: `/timesheet/getDefault/${selectedEmail}/` }
    const { data:defaultSchedule, restart: refetchDefault } = useModifiedFetchLocal<any>(defaultEndpoint)

    const approvalEndpoint = { endpoint: `/timesheet/isApproved/${selectedPeriod.period_id}/${selectedEmail}/` }
    const { data:isApproved, refetch:refetchApproval } = useModifiedFetchLocal<any>(approvalEndpoint)

    const timestampEndpoint = { endpoint: `/timesheet/timestamp/${selectedPeriod.period_id}/${selectedEmail}/` }
    const { data:timestamp, refetch:refetchTimestamp } = useModifiedFetchLocal<any>(timestampEndpoint);

    // When new user is selected, refetch their user data
    useEffect(() => {
        refetchViewedUser();
        refetchDefault();
    }, [selectedEmail]);

    // When a new user / period is selected, fetch the schedule
    useEffect(() => {
        setScheduleLoading(true);
        refetchLatest();
    }, [selectedPeriod, selectedEmail]);

    useEffect(() => {

        // No response.
        if (!latestSchedule) { 
            setScheduleLoading(false);
            return; 
        }
        setScheduleLoading(false);
        const formatted = convertToCalendar(latestSchedule);
        console.log("FORM", formatted);
        setWeekOneEvents(formatted.Week1);
        setWeekTwoEvents(formatted.Week2);
    }, [latestSchedule]);

    const goToPrevious = () => {}
    const goToNext = () => {}
    const saveEdits = () => {
        console.log(calendarToResponse(weekOneEvents, weekTwoEvents))
        fetchLocalWithBody(`/timesheet/modify/${selectedPeriod.period_id}/${selectedEmail}`, calendarToResponse(weekOneEvents, weekTwoEvents))
            .then(() => {
                setIsEdited(false);
            })
            .catch(() => console.error("error."))
    }

    const revert = () => {}
    const submit = () => {}

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
                <StatText completionState={isApproved ? 'done' : 'action-needed'} label={"Approved"} content={ isApproved ? 'Yes' : 'No'} />
                <BoxedStat variant="circle" size="small" stat={(weekOneHours + weekTwoHours).toString()} label="Total Hours Worked"/>
                <Space h='md' />
                <Group>
                    <Button variant="outline" onClick={() => revert()}>Discard</Button>
                    <DefaultButton text="Submit" onClick={() => submit()} />
                </Group>
            </Stack>
            <Divider orientation="vertical" />
            <Stack gap={2} align="flex-start">
                <StatText label="Hours (Week 1)" content={weekOneHours.toString()}/>
                <StatText label="Hours (Week 2)" content={weekTwoHours.toString()}/>
                { 
                    (timestamp?.submitted_timestamp) 
                    ? <i>{timestamp.toLocaleDateString()} {timestamp.toLocaleTimeString() }</i>
                    : <></>
                }
            </Stack>
        </Group>
    </div>
    )
}