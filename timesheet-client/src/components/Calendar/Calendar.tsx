//@ts-nocheck
import React, {useState, useEffect, useMemo, useCallback } from "react";
import './styles.css'
import './dndSass/styles.css'

import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar'
import withDragAndDrop from './dragAndDrop'


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

// const DragAndDropCalendar = withDragAndDrop(Calendar)


// Adapted from: 
// https://github.com/jquense/react-big-calendar/blob/master/stories/demos/exampleCode/selectable.js
// https://github.com/jquense/react-big-calendar/blob/master/stories/demos/exampleCode/dnd.js

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

      const moveEvent = useCallback(
        ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
          const { allDay } = event
          if (!allDay && droppedOnAllDaySlot) {
            event.allDay = true
          }
          if (allDay && !droppedOnAllDaySlot) {
              event.allDay = false;
          }
    
          setEvents((prev) => {
            const existing = prev.find((ev) => ev.id === event.id) ?? {}
            const filtered = prev.filter((ev) => ev.id !== event.id)
            return [...filtered, { ...existing, start, end, allDay: event.allDay }]
          })
        },
        [setEvents]
      )
    
      const resizeEvent = useCallback(
        ({ event, start, end }) => {
            setEvents((prev) => {
            const existing = prev.find((ev) => ev.id === event.id) ?? {}
            const filtered = prev.filter((ev) => ev.id !== event.id)
            return [...filtered, { ...existing, start, end }]
          })
        },
        [setEvents]
      )

    const handleSelectSlot = useCallback(
    ({ start, end }) => {
        const title = window.prompt('New Event name')
        if (title) {
        setEvents((prev) => [...prev, { start, end, title }])
        }
    },
    [setEvents]
    )
    
    const handleSelectEvent = useCallback(
        (event) => window.alert(event.title),
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

        onEventDrop={moveEvent}
        onEventResize={resizeEvent}
        popup
        selectable
        startAccessor="start"
        endAccessor="end"
        scrollToTime={scrollToTime}

        style={{ height: 500 }}
    /></>
}