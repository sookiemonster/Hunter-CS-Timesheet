import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Select, SegmentedControl, Stack } from '@mantine/core';
import { CalendarModificationContext } from "./CalendarModificationContext";
import './modalStyles/styles.css';

interface TimePickerProps {
    label: 'start' | 'end',
    setter : any,
    hasError?: Boolean
    showError?: Boolean
};

export default function TimePicker({label, setter, hasError, showError}:TimePickerProps) {
    const { selected } = useContext(CalendarModificationContext);
    const time = (label === 'start') ? selected.start : selected.end;
    
    const extractHours = useMemo(() => (time.getHours() % 12 || 12).toString(), [time])
    const extractMinutes = useMemo(() => (time.getMinutes() || '00') .toString(), [time])
    const extractZone = useMemo(() => (time.getHours() < 12) ? 'AM': 'PM', [time])
    
    const [hours, setHours] = useState<string | null>(extractHours);
    const [minutes, setMinutes] = useState<string | null>(extractMinutes);
    const [AM, setAM] = useState<string | null> (extractZone);

    useEffect(() => {
        setHours(extractHours)
        setMinutes(extractMinutes)
        setAM(extractZone)
    }, 
    [selected])


    const hoursOptions = useMemo(
        () => Array.from({ length: 12 }, (_, i) => ({
            label: `${i + 1}`,
            value: `${i + 1}`,
        })), []
    )
    
    const minutesOptions = useMemo(
        () => Array.from({ length: 6 }, (_, i) => ({
            label: `${i === 0 ? '0' : ''}${i*10}`,
            value: `${i === 0 ? '0' : ''}${i*10}`,
        })), []
    )

    useEffect(() => {
        if (!selected) { return ;}
        // Get current date that is selected
        const updatedTime = new Date(selected.start);
        if (!hours || !minutes || !AM) { return; }
        
        // Create new time object
        updatedTime.setHours(
            (parseInt(hours) % 12) + ((AM === 'AM') ? 0 : 12)
        );
        updatedTime.setMinutes(parseInt(minutes));
        
        setter(updatedTime);
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