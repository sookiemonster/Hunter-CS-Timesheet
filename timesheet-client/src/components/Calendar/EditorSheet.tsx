import React, {useContext, useEffect, useMemo, useState} from "react";
import { CalendarModificationContext } from "./CalendarModificationContext";
import { Modal, Button, TextInput } from '@mantine/core';
import TimePicker from "./TimePicker";

export default function EditorSheet() {
    const { selected, saveEdits, opened, close, deleteSelected, updateTemp, clearTemp } = useContext(CalendarModificationContext);

    const [title, setTitle] = useState('');
    const [start, setStart] = useState(new Date(1990,1,1,9,0,0));
    const [end, setEnd] = useState(new Date(1990,1,1,10,0,0));

    useEffect (() => {
        setTitle(selected?.title || 'New Event')
        setStart(selected.start)
        setEnd(selected.end)
    }, [selected])


    useEffect(() => {
        if (!opened) { return; }
        if (!selected) { console.error("NO SELECTION"); return; }
        updateTemp(selected.start, selected.end, selected.title);

    }, [opened])

    const submit = () => {
        saveEdits(start, end, title);
    }

    return(
    <Modal opened={opened} onClose={() => { close(); clearTemp() }} centered>
        <TextInput 
            label = "Activity" 
            description="" 
            placeholder="Please enter what these hours are for" 
            value={title}
            onChange={(event) => setTitle(event.currentTarget.value)}></TextInput>
        <TimePicker label="start" setter={setStart}/>
        <Button onClick={() => submit()}>MODIFY</Button>
        <Button onClick={() => deleteSelected()}>DELETE</Button>
        {/* <Button onClick={() => submit()}>MODIFY</Button> */}
    </Modal>
    )
}