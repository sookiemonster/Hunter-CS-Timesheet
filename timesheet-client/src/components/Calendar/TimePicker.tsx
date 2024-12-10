import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Select, SegmentedControl, Stack, Text } from '@mantine/core';
import { CalendarModificationContext } from "./CalendarModificationContext";
import './modalStyles.css';

interface TimePickerProps {
    label: 'start' | 'end',
    setter : any,
    hasError?: Boolean
    showError?: Boolean
};

export default function TimePicker({label, setter, hasError, showError}:TimePickerProps) {
    const { selected } = useContext(CalendarModificationContext);
    const time = (label === 'start') ? selected.start : selected.end;

    const [hours, setHours] = useState<string | null>((time.getHours() % 12 || 12).toString());
    const [minutes, setMinutes] = useState<string | null>((time.getMinutes() || '00') .toString());
    const [AM, setAM] = useState<string | null> (
        (time.getHours() < 12) 
            ? 'AM'
            : 'PM'
    );

    const hoursOptions = Array.from({ length: 12 }, (_, i) => ({
        label: `${i + 1}`,
        value: `${i + 1}`,
    }));
    
    const minutesOptions = Array.from({ length: 6 }, (_, i) => ({
        label: `${i === 0 ? '0' : ''}${i*10}`,
        value: `${i === 0 ? '0' : ''}${i*10}`,
    }));
    
    const ampmOptions = [
        { label: 'AM', value: 'AM' },
        { label: 'PM', value: 'PM' },
    ];

    useEffect(() => {
        if (!selected) { return ;}
        const updatedStart = new Date(selected.start);
        console.log("OLD START", updatedStart)
        if (!hours || !minutes || !AM) { return; }

        updatedStart.setHours(
            (parseInt(hours) % 12) + ((AM === 'AM') ? 0 : 12)
        );
        updatedStart.setMinutes(parseInt(minutes));
        console.log("NEW START", updatedStart)
        setter(updatedStart);
    }, [hours, minutes, AM])
    
    return (
    <Stack>
    <div className="time-container">
        <Select
        placeholder="Select Hour"
        data={hoursOptions}
        value={hours}
        onChange={(value) => setHours(value)}
        variant="filled"
        size="sm"
        error={
            hasError 
            ? " "
            : ""
        }
        
        checkIconPosition="right"
        allowDeselect={false}
        searchable
        />

        <Select
        placeholder="Select Minutes"
        data={minutesOptions}
        value={minutes}
        onChange={(value) => setMinutes(value)}
        variant="filled"
        size="sm"
        error={(hasError) ? " " : null}        
        
        checkIconPosition="right"
        allowDeselect={false}
        searchable
        />

        <SegmentedControl 
            data={['AM', 'PM']} 
            value={AM || 'AM'}
            onChange={(value) => setAM(value)}
            color="softpurple.4"
            size="sm"
            />
    </div>
    <small style={{color: 'red'}}>
    {(hasError && showError ? "Start time must be before end." : " ")}
    </small>
    </Stack>
    );
}