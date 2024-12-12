import React, {useState, useContext, useMemo, useEffect} from 'react';
import { Table, Group, LoadingOverlay, Loader } from '@mantine/core';
import { IndicatorSymbol } from '../Buttons';
import { ControlContext } from '../../state/Control.tsx/ControlContext';
import { useFetchLocal, useModifiedFetchLocal } from '../../state/hooks';
import { User } from '../../state/User';
import { useNavigate } from 'react-router-dom';
import './styles/styles.css';

interface Row {
    full_name:string,
    email:string,
    timestamp: string,
    approved:boolean,
    total_hrs: number,
}

interface TimesheetData {
    email:string,
    submitted_timestamp:string,
    approved:boolean,
    submitted_schedule : string
}

export default function Tabular() {
    const navigate = useNavigate();
    const { selectEmail, selectedPeriod } = useContext(ControlContext);

    const { data:allUsers, loading:allUsersLoading, restart:refetchUsers } = useFetchLocal<User[]>("/users/all");

    const allTimesheetsEndpoint = { endpoint: `/timesheet/all/${selectedPeriod.period_id}`};
    const { data:allTimesheetData, refetch:refetchTimesheets} = useModifiedFetchLocal<TimesheetData[]>(allTimesheetsEndpoint)

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        refetchUsers();
        refetchTimesheets();
    }, [selectedPeriod])

    const data = useMemo(():Row[] => {
        if (!allUsers || !allTimesheetData) { return []; }
        const result:Row[] = [];
        allUsers.forEach((userInfo) => {
            // find if we have a submitted timesheet
            const found = allTimesheetData.find((sheet) => userInfo.email == sheet.email )
            let total_hrs = -1
            if (found && found['submitted_schedule'] && ! isNaN(JSON.parse(found['submitted_schedule'])['Total_Hours_Week2'] + JSON.parse(found['submitted_schedule'])['Total_Hours_Week1']) ) {
                let json = JSON.parse(found['submitted_schedule'])
                total_hrs = json['Total_Hours_Week2'] + json['Total_Hours_Week1']
            } else if (found) {
                try {
                    // if there are no hours, we'll calculate total hours for now
                    // this is a workaround because it appears that when a schedule
                    // is submitted, the total_hours isn't sent with it
                    // this is a workaround remove this and perhaps the clause above it
                    // if you're able to normalize / validate the schema of the 
                    type ScheduleStructure = Record<string, Record<string, { start: string; end: string }[]>>;
                    total_hrs = 0
                    const json: ScheduleStructure = JSON.parse(found['submitted_schedule']);
                    console.log(json)
                    for (const week of Object.values(json)) {
                      for (const day of Object.values(week)) {
                        for (const shift of day) {
                          if (shift) {
                            const [startHours, startMinutes] = shift.start.split(':').map(Number);
                            const [endHours, endMinutes] = shift.end.split(':').map(Number);
                            
                            const hoursWorked = (endHours * 60 + endMinutes - (startHours * 60 + startMinutes)) / 60.0;
                            total_hrs += hoursWorked;
                        }
                        }
                      }
                    }

                } catch (error) {
                    total_hrs = -1
                }
            } else {
                total_hrs = -1
            }
            const formatted:Row = {
                full_name: userInfo.full_name,
                email: userInfo.email as string,
                timestamp: "Unsubmitted",
                approved: false,
                total_hrs: total_hrs,
            }
            if (found) {
                formatted.timestamp = (new Date(found.submitted_timestamp)).toLocaleDateString();
                formatted.approved = found.approved
            }
            result.push(formatted);
        })

        setIsLoading(false);

        return result;
    }, [allUsers, allTimesheetData])

    const handleClick = (email:string) => {
        selectEmail(email);
        navigate("/timesheets");
    }

    const rows = useMemo(
        () => data.map((element:Row) => {
            return <Table.Tr className='row' key={element.email} onClick={() => handleClick(element.email)}>
                <Table.Td>{element.full_name}</Table.Td>
                <Table.Td>{element.email}</Table.Td>
                <Table.Td className={`${element.timestamp === "Unsubmitted" ? "none" : ""}`}>
                    {element.timestamp}
                </Table.Td>
                <Table.Td>
                    <IndicatorSymbol value={element.approved ? 'yes' : 'no'} />
                </Table.Td>
                <Table.Td>
                    {element.total_hrs === -1 ? "N/A" : element.total_hrs}
                </Table.Td>
            </Table.Tr>
    }), [data]);

    return <div id="table-container">
        { isLoading 
            ? <Loader />
            : <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Employee</Table.Th>
                        <Table.Th>Email</Table.Th>
                        <Table.Th>Submitted</Table.Th>
                        <Table.Th>Approved</Table.Th>
                        <Table.Th>Total Hours</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
            
        }
    </div>
}