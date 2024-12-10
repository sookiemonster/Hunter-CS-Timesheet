import React, {useContext, useEffect, useState} from "react";
import { CalendarModificationContext } from "./CalendarModificationContext";

import { useHotkeys  } from '@mantine/hooks';
import { Modal, Button, Divider, Group, Stack } from '@mantine/core';
import TimePicker from "./TimePicker";
import { TrashButton } from "../Buttons";

export default function EditorSheet() {
    const { selected, saveEdits, opened, close, deleteSelected, updateTemp, clearTemp, clearSelected, selectedWeekOne } = useContext(CalendarModificationContext);

    const [start, setStart] = useState(new Date(1990,1,1,9,0,0));
    const [end, setEnd] = useState(new Date(1990,1,1,10,0,0));

    const [error, setError] = useState(false);
    
    const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    useHotkeys([
        ['Enter', () => {
            if (!selected || !opened) { return; }
            submit();
        }]
    ]);

    useEffect (() => {        
        setStart(selected.start)
        setEnd(selected.end)
    }, [selected])


    useEffect(() => {
        if (!opened || !selected) { clearTemp(); return; }
        if (start > end) { setError(true); }
        else { setError(false); }
        updateTemp(start, end, '');
    }, [opened, start, end])

    const submit = () => {
        if (start < end) {
            saveEdits(start, end, '');
        }
    }

    return(
    <Modal opened={opened} onClose={() => { clearSelected(); close(); clearTemp(); }} centered>
        <Stack>
        <Stack gap={0}>
            <h3 style={{margin: 0, padding: 0}}>Shift</h3>
            <small>{ weekdays[start.getDay()] } { selectedWeekOne ? '1' : '2'}</small>
        </Stack>
            <div>
                <small><b>in</b></small>
                <TimePicker hasError={error} label="start" setter={setStart}/>
            </div>
            <Divider/>
            <div>
                <small><b>out</b></small>
                <TimePicker hasError={error} showError={true} label="end" setter={setEnd}/>
            </div>
            <Group>
                <Button color="softpurple" onClick={() => submit()}>Save</Button>
                <TrashButton onClick={() => { clearTemp(); deleteSelected(); close();  } } />
            </Group>
        </Stack>
    </Modal>
    )
}