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
}

interface TimesheetData {
    email:string,
    submitted_timestamp:string
    approved:boolean,
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
            const formatted:Row = {
                full_name: userInfo.full_name,
                email: userInfo.email as string,
                timestamp: "Unsubmitted",
                approved: false
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
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
            
        }
    </div>
}