import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Group, Select } from '@mantine/core';
import { CalendarModificationContext } from "./CalendarModificationContext";

interface TimePickerProps {
    label: 'start' | 'end',
    setter : any
};

export default function TimePicker({label, setter}:TimePickerProps) {
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
    
    const minutesOptions = Array.from({ length: 60 }, (_, i) => ({
        label: `${i < 10 ? '0' : ''}${i}`,
        value: `${i < 10 ? '0' : ''}${i}`,
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
            (AM === 'AM') 
            ?   parseInt(hours) % 12
            :   parseInt(hours)
        );
        updatedStart.setMinutes(parseInt(minutes));
        console.log("NEW START", updatedStart)
        setter(updatedStart);
    }, [hours, minutes, AM])
    
    return (
    <Group>
        <Select
        label="Hour"
        placeholder="Select Hours"
        data={hoursOptions}
        value={hours}
        onChange={(value) => setHours(value)}

        checkIconPosition="right"
        allowDeselect={false}
        searchable
        />
        <Select
        label="Minutes"
        placeholder="Select Minutes"
        data={minutesOptions}
        value={minutes}
        onChange={(value) => setMinutes(value)}

        checkIconPosition="right"
        allowDeselect={false}
        searchable
        />
        <Select
        label="AM/PM"
        placeholder="Select AM/PM"
        data={ampmOptions}
        value={AM}
        onChange={(value) => setAM(value)}
        
        checkIconPosition="right"
        allowDeselect={false}
        searchable
        />
    </Group>
    );
}