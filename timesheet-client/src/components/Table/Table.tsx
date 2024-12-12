import React, {useContext, useMemo} from 'react';
import { Table } from '@mantine/core';
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
    approved:Boolean,
}

export default function Tabular() {
    const navigate = useNavigate();
    const { selectedEmail, selectEmail, selectedPeriod } = useContext(ControlContext);

    const { data:allUsers, loading:allUsersLoading  } = useFetchLocal<User[]>("/users/all");

    const allTimesheetsEndpoint = { endpoint: '/timesheet/all/:period_no'};
    const allTimesheetData = useModifiedFetchLocal<any>(allTimesheetsEndpoint)

    console.log(allUsers);
    console.log(allTimesheetData);

    const constructData = useMemo(() => {
        
    }, [allUsers, allTimesheetData])

    const handleClick = (email:string) => {
        selectEmail(email);
        navigate("/timesheets");
    }

    const data:Row[] = [];
    const rows = useMemo(
        () => data.map((element:Row) => {
            <Table.Tr key={element.email} onClick={() => handleClick(element.email)}>
                <Table.Td>{element.full_name}</Table.Td>
                <Table.Td>{element.email}</Table.Td>
                <Table.Td>
                    {
                        element.timestamp
                        ? element.timestamp
                        : <IndicatorSymbol value={'no'} />
                    }
                </Table.Td>
                <Table.Td>
                    <IndicatorSymbol value={element.approved ? 'yes' : 'no'} />
                </Table.Td>
            </Table.Tr>
    }), [data]);

    return <div id="table-container">
        <Table>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Employee</Table.Th>
                    <Table.Th>Submitted</Table.Th>
                    <Table.Th>Approved</Table.Th>
                </Table.Tr>
            </Table.Thead>
            {/* <Table.Tbody>{rows}</Table.Tbody> */}
        </Table>
    </div>
}