import React, {useContext, useEffect, useMemo, useState} from "react";
import { CalendarModificationContext } from "./CalendarModificationContext";
import { Modal, Button, TextInput } from '@mantine/core';

export default function EditorSheet() {
    const { selected, saveEdits, opened, close, deleteSelected } = useContext(CalendarModificationContext);

    const [title, setTitle] = useState('');
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const NULL_ID = useMemo(() => crypto.randomUUID(), []);

    useEffect (() => {
        setTitle(selected?.title || 'New Event');
        setStart(selected.start);
        setEnd(selected.end);

        console.log( selected, "SELECTED");
        console.log( title, start, end);
    }, [selected])

    useEffect(() => {
        if (!opened) { return; }
        // saveEdits(start, end, title);

    }, [opened, title, start, end])

    const submit = () => {
        saveEdits(start, end, title);
    }

    return(
    <Modal opened={opened} onClose={close} centered>
        <TextInput 
            label = "Activity" 
            description="" 
            placeholder="Please enter what these hours are for" 
            value={title}
            onChange={(event) => setTitle(event.currentTarget.value)}></TextInput>

        <Button onClick={() => submit()}>MODIFY</Button>
        <Button onClick={() => deleteSelected()}>DELETE</Button>
        {/* <Button onClick={() => submit()}>MODIFY</Button> */}
    </Modal>
    )
}