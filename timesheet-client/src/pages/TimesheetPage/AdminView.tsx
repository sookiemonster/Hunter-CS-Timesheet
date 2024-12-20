import React, { useContext, useEffect, useState, useMemo, useCallback } from "react";

import PeriodHeader from "../../components/PeriodHeader";
import { Button, Divider, Group, Loader, LoadingOverlay, Space, Stack, Text } from "@mantine/core";
import ScheduleCalendar from "../../components/Calendar";
import BoxedStat from "../../components/Stats";
import { ArrowButton, DefaultButton, IndicatorSymbol, TrashButton } from "../../components/Buttons";
import { StatText } from "./TimesheetPage";
import './styles/styles.css'

import { ControlContext } from "../../state/Control.tsx/ControlContext";
import { User } from "../../state/User";
import { convertToCalendar } from "../../state/Schedule";
import { CalendarModificationContext } from "../../components/Calendar/CalendarModificationContext";
import { calendarToResponse } from "../../state/Schedule/Schedule";
import { useFetchLocal, useModifiedFetchLocal} from "../../state/hooks";
import { fetchLocal, fetchLocalWithBody } from "../../state/Util";

export default function TimesheetPageAdmin():JSX.Element {
    const { selectedPeriod, selectEmail }= useContext(ControlContext)
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
    const isSubmitted = (timestamp && timestamp.length > 0 && timestamp[0]?.submitted_timestamp);

    const { data:allUsers, loading:allUsersLoading  } = useFetchLocal<User[]>("/users/all");
    const [indexOfUser, selectIndex] = useState(-1);

    // When all users are found, we find where we are in our user table and proceed for L/R arrows
    useEffect(() => {
        if (allUsersLoading || !allUsers) {return;}
        const found = allUsers.findIndex((user) => { return user.email === selectedEmail; })
        if (found < 0) { selectIndex(0); }
        selectIndex(found);
    }, [allUsers])

    useEffect(() => {
        // cannot read all users
        if (!allUsers) { return; }
        console.log(indexOfUser);
        // If we haven't selected a user or if we are already at them, we need not move
        if (indexOfUser === -1 || indexOfUser === allUsers.findIndex((user) => { return user.email === selectedEmail; })) {
            return;
        }
        selectEmail(allUsers[indexOfUser].email);
    }, [indexOfUser])

    // When new user is selected, refetch their user data
    useEffect(() => {
        refetchViewedUser();
        refetchDefault();
    }, [selectedEmail]);

    // When a new user / period is selected, fetch the schedule
    useEffect(() => {
        setIsEdited(false);
        setScheduleLoading(true);
        refetchApproval();
        refetchLatest();
        refetchTimestamp();
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

    const goToPrevious = useCallback(() => {
        if (indexOfUser == -1 || !allUsers) { return; }
        const isWrapping = (indexOfUser === 0);
        selectIndex(
            isWrapping
                ? allUsers.length - 1
                : indexOfUser - 1
        )
    }, [allUsers, indexOfUser])

    const goToNext = useCallback(() => {
        if (indexOfUser == -1 || !allUsers) { return; }
        const isWrapping = (indexOfUser === allUsers.length - 1);
        selectIndex(
            isWrapping
                ? 0
                : indexOfUser + 1
        )
    }, [allUsers, indexOfUser])

    const clearEdits = () => {
        setIsEdited(false);
        setScheduleLoading(true);
        refetchLatest();
    }

    const saveEdits = () => {
        console.log(calendarToResponse(weekOneEvents, weekTwoEvents))
        fetchLocalWithBody(`/timesheet/modify/${selectedPeriod.period_id}/${selectedEmail}`, calendarToResponse(weekOneEvents, weekTwoEvents))
            .then(() => {
                setIsEdited(false);
            })
            .catch(() => console.error("error."))
    }
    const approve = () => {
        fetchLocal(`/timesheet/approve/${selectedPeriod.period_id}/${selectedEmail}`)
            .then(() => {
                refetchApproval()
            })
            .catch(() => alert("An error has occurred."))
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
                <b>Approved? </b>
                <IndicatorSymbol showValue={true} value={isApproved ? 'yes' : 'no'} />
            </Group>
        </Group>
        <Space h='xs'/>
        <div id="calendar-container">
            <ScheduleCalendar />
            <LoadingOverlay visible={scheduleLoading} />
        </div>
        <Group className="actions-container" align="flex-start">
            <Stack gap={20} >
                {/* <StatText completionState={isDefault ? 'done' : 'action-needed'} label={"Default Hours"} content={ isDefault ? 'Yes' : 'No'} /> */}
                {/* <Space h='md' /> */}
                <Group>
                    <ArrowButton direction="left" onClick={() => goToPrevious()} />
                    {
                        isEdited
                        ? <>
                        <TrashButton  onClick={() => clearEdits()} />
                        <Button disabled={isApproved} variant="outline" onClick={() => saveEdits()}>Save Changes</Button>
                        </>
                        : <></>
                    }
                    <Button color="softpurple.4" disabled={isApproved || !isSubmitted} onClick={() => approve()} >
                        {
                            isApproved
                            ? 'Approved'
                            : !isSubmitted  
                                ? 'Unsubmitted'
                                : 'Approve'
                        }
                        
                    </Button>
                    <ArrowButton direction="right" onClick={() => goToNext()} />
                </Group>
                {
                isEdited
                ? <Group gap={10} justify="center">
                    <b>Edited </b>
                    <IndicatorSymbol noImplication={true} showValue={true} value={isEdited ? 'yes' : 'no'} />
                </Group>
                : <></>
                }
            </Stack>
            <Divider orientation="vertical" />
            <Stack gap={2} align="flex-start">
                <StatText label="Hours (Week 1)" content={weekOneHours.toString()}/>
                <StatText label="Hours (Week 2)" content={weekTwoHours.toString()}/> 
                <BoxedStat variant="circle" size="small" stat={(weekOneHours + weekTwoHours).toString()} label="Total Hours Worked"/>
                { 
                    (timestamp && timestamp.length > 0 && timestamp[0]?.submitted_timestamp) 
                    ? <Text size="sm">
                        <i>Last submission: {(new Date(timestamp[0].submitted_timestamp)).toLocaleDateString()}</i>
                    </Text>
                    : <></>
                }
            </Stack>
        </Group>
    </div>
    )
}