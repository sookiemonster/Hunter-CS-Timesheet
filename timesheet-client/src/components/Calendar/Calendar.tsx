//@ts-nocheck
import React, {useState, useEffect, useMemo, useCallback, useContext } from "react";
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';

import {CalendarModificationProvider, CalendarModificationContext} from "./CalendarModificationContext";
import EditorSheet from "./EditorSheet";

// import { useMouse } from '@mantine/hooks';
import './styles.css'

import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar'

import {format} from 'date-fns/format'
import {parse} from 'date-fns/parse'
import {startOfWeek} from 'date-fns/startOfWeek'
import {getDay} from 'date-fns/getDay'
import {enUS} from 'date-fns/locale/en-US'
import { sub } from "date-fns";

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

// Adapted from: 
// https://github.com/jquense/react-big-calendar/blob/master/stories/demos/exampleCode/selectable.js

export default function ScheduleCalendar():JSX.Element {
    const {weekOneEvents, weekTwoEvents, temporaryEvents,
        setSelected,
        open, saveEdits, 
        selectedWeekOne, selectWeek } = useContext(CalendarModificationContext);
    
    // Config
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

    const handleSelectSlot = useCallback(({ start, end }) => {
        const newEvent = {
            "name": 'New Event',
            "start": start,
            "end": end,
            id: crypto.randomUUID()
        }
        setSelected(newEvent);
        open();
    })
    
    const handleSelectEvent = useCallback((event) => {
        setSelected(event);
        open();
    }, [])

    return <>
        <Calendar
            localizer={localizer}
            toolbar={false}
            formats={formats}
            drilldownView={Views.WEEK}
            defaultView={Views.WEEK}
            allDayMaxRows={0}
            defaultDate={defaultDate} // So we don't have any weird highlighting
            
            events={(selectedWeekOne) ? weekOneEvents : weekTwoEvents}
            backgroundEvents={temporaryEvents}

            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            popup
            selectable
            startAccessor="start"
            endAccessor="end"
            scrollToTime={scrollToTime}

            style={{ height: 500 }}
        />
        <EditorSheet />
    </>
};