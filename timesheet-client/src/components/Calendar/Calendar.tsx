//@ts-nocheck
import React, {useState, useEffect, useMemo } from "react";
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

export default function ScheduleCalendar():JSX.Element {
    // We simulate the date periods here.

    const { formats } = useMemo(
        () => ({
          formats: {
            dayFormat: (date, culture, localizer) =>
              localizer.format(date, 'EE', culture),
            timeGutterFormat: (date, culture, localizer) => 
                localizer.format(date, 'h a', culture),
          }
        }),
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
      defaultDate={new Date(2020,1,1)} // So we don't have any weird highlighting
    //   events={myEventsList}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    /></>
}