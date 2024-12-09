//@ts-nocheck
import React, {useState, useEffect, useMemo, useCallback } from "react";
import './styles.css'

import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar'

import {format} from 'date-fns/format'
import {parse} from 'date-fns/parse'
import {startOfWeek} from 'date-fns/startOfWeek'
import {getDay} from 'date-fns/getDay'
import {enUS} from 'date-fns/locale/en-US'

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

interface Event {
    title:string,
    start: Date,
    end: Date,
    allDay?: boolean
}

// Adapted from: 
// https://github.com/jquense/react-big-calendar/blob/master/stories/demos/exampleCode/selectable.js

export default function ScheduleCalendar():JSX.Element {
    // We simulate the date periods here.
    const [events, setEvents] = useState([])

    const { defaultDate, formats, scrollToTime } = useMemo(
        () => ({
            defaultDate: new Date(2020,1,1),
            formats: {
                dayFormat: (date, culture, localizer) =>
                localizer.format(date, 'EE', culture),
                timeGutterFormat: (date, culture, localizer) => 
                    localizer.format(date, 'h a', culture),
            },
            scrollToTime: new Date(1970, 1, 1, 9),
        }),[]
      )

    const handleSelectSlot = useCallback(
    ({ start, end }) => {
        const title = window.prompt('New Event name')
        const uniqueId = crypto.randomUUID();
        
        if (title) {
        setEvents((prev) => {
            console.log(prev);
            return [...prev, { "start": start, "end": end, "title": title, "id": uniqueId }]
        })
        }
    },
    [setEvents]
    )
    
    const handleSelectEvent = useCallback(
        (event) => {
            const title = window.prompt('new event title')
            console.log(event.id)
            if (!title) { return; }
            
            setEvents((prev) => {
                const updated_events = prev.filter(itr => itr.id !== event.id);
                event.title = title;
                return [...updated_events, event];
            })
        },
        []
    )

    return <>
    <Calendar
        localizer={localizer}
        toolbar={false}
        formats={formats}
        drilldownView={Views.WEEK}
        defaultView={Views.WEEK}
        allDayMaxRows={0}
        defaultDate={defaultDate} // So we don't have any weird highlighting
        events={events}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        popup
        selectable
        startAccessor="start"
        endAccessor="end"
        scrollToTime={scrollToTime}

        style={{ height: 500 }}
    /></>
}