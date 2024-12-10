import React, {useContext, useEffect, useMemo, useState} from "react";
import { CalendarModificationContext } from "./CalendarModificationContext";

import { useHotkeys  } from '@mantine/hooks';
import { Modal, Button, TextInput, Divider, Group, Stack, ActionIcon } from '@mantine/core';
import TimePicker from "./TimePicker";
import { TrashButton } from "../Buttons";

export default function EditorSheet() {
    const { selected, saveEdits, opened, close, deleteSelected, updateTemp, clearTemp, clearSelected } = useContext(CalendarModificationContext);

    const [title, setTitle] = useState('');
    const [start, setStart] = useState(new Date(1990,1,1,9,0,0));
    const [end, setEnd] = useState(new Date(1990,1,1,10,0,0));

    useHotkeys([
        ['Enter', () => {
            if (!selected || !opened) { return; }
            submit();
        }]
    ]);

    useEffect (() => {        
        setTitle(selected?.title || 'New Event')
        setStart(selected.start)
        setEnd(selected.end)
    }, [selected])


    useEffect(() => {
        if (!opened || !selected) { clearTemp(); return; }
        updateTemp(start, end, title);
    }, [opened, start, end])

    const submit = () => {
        saveEdits(start, end, title);
    }

    return(
    <Modal opened={opened} onClose={() => { close(); clearSelected(); }} centered>
        <Stack>
        <Group>
            <h3>Shift</h3>
            <TextInput 
                description="" 
                placeholder="Activity" 
                value={title}
                onChange={(event) => setTitle(event.currentTarget.value)}></TextInput>
            
        </Group>
            <div>
                <small><b>in</b></small>
                <TimePicker label="start" setter={setStart}/>
            </div>
            <Divider/>
            <div>
                <small><b>out</b></small>
                <TimePicker label="end" setter={setEnd}/>
            </div>
            <Group>
                <Button color="softpurple" onClick={() => submit()}>Save</Button>
                <TrashButton onClick={() => deleteSelected()} />
            </Group>
        </Stack>
    </Modal>
    )
}