//@ts-nocheck
import React, { useEffect, useMemo, useCallback, useContext } from "react";
import { SegmentedControl, Group, Stack } from '@mantine/core';

import { CalendarModificationContext, CalendarModificationProvider } from "./CalendarModificationContext";
import { MouseHistoryProvider } from "./MouseHistoryContext";
import EditorSheet from "./EditorSheet";

// import { useMouse } from '@mantine/hooks';
import './calendarStyles/styles.css'

import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar'

import {format} from 'date-fns/format'
import {parse} from 'date-fns/parse'
import {startOfWeek} from 'date-fns/startOfWeek'
import {getDay} from 'date-fns/getDay'
import {enUS} from 'date-fns/locale/en-US'
import { sub } from "date-fns";
import { MouseHistoryContext } from "./MouseHistoryContext";

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

export function ScheduleCalendarComponent():JSX.Element {
    const {weekOneEvents, weekTwoEvents, temporaryEvents,
        setSelected, open, close,
        selectedWeekOne, selectWeek } = useContext(CalendarModificationContext);
    const { storeCurrentPosition, storedMousePosition } = useContext(MouseHistoryContext);
    
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

    const weekOptions = useMemo(
        () => [
            {
                label: 'Week 1',
                value: 'true'
            },
            {
                label: 'Week 2',
                value: 'false',
            }
        ], []
    ) 

    const handleSelectSlot = ({ start, end }) => {
        const newEvent = {
            "name": 'New Event',
            "start": start,
            "end": end,
            id: crypto.randomUUID()
        }
        storeCurrentPosition();
        setSelected(newEvent);
        open();
    }
    
    const handleSelectEvent = (event) => {
        storeCurrentPosition();
        setSelected(event);
        open();
    }

    return <Stack>
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
        {/* Segmented control only seems to work with string values */}
        <Group justify="flex-end">
        <SegmentedControl 
            color={"softpurple.4"}
            data={weekOptions}
            onChange={(value) => selectWeek(value === 'true')}
            value={selectedWeekOne.toString()}
        />
        </Group>
        <EditorSheet />
    </Stack>
};

export default function ScheduleCalendar() {
    return (
        <MouseHistoryProvider>
            <ScheduleCalendarComponent />
        </MouseHistoryProvider>
    )
}