import React, {useContext, useEffect, useMemo, useState} from "react";
import { CalendarModificationContext } from "./CalendarModificationContext";

import { useHotkeys  } from '@mantine/hooks';
import { Modal, Button, TextInput } from '@mantine/core';
import TimePicker from "./TimePicker";

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
        <TextInput 
            label = "Activity" 
            description="" 
            placeholder="Please enter what these hours are for" 
            value={title}
            onChange={(event) => setTitle(event.currentTarget.value)}></TextInput>
        <TimePicker label="start" setter={setStart}/>
        <TimePicker label="end" setter={setEnd}/>
        <Button onClick={() => submit()}>Save</Button>
        <Button onClick={() => deleteSelected()}>Delete</Button>
    </Modal>
    )
}