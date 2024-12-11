export interface Shift {
    start: string
    end: string
}

export interface WeeklyBreakdown {
    Sun: Shift[]
    Mon: Shift[]
    Tue: Shift[]
    Wed: Shift[]
    Thu: Shift[]
    Fri: Shift[]
    Sat: Shift[]
}

export interface Schedule {
    Week1:WeeklyBreakdown
    Week2:WeeklyBreakdown
}

export interface ShiftOnDay {
    start:Date,
    end:Date,
    dayNo:number
}

export interface CalendarResponse {
    Week1:ShiftOnDay[]
    Week2:ShiftOnDay[]
}

export function responseToCalendar(serialized:string):CalendarResponse {
    // WHAT WHO USES 0-indexing for months???
    const WEEK_START = new Date(2020,0,26);
    // console.log(WEEK_START);

    const schedule = JSON.parse(serialized);
    const getDayNumber = (day: string): number => {
        switch (day) {
            case 'Sun': return 0;
            case 'Mon': return 1;
            case 'Tue': return 2;
            case 'Wed': return 3;
            case 'Thu': return 4;
            case 'Fri': return 5;
            case 'Sat': return 6;
            default: return -1;
        }
    }

    const result:CalendarResponse = {
        Week1:[],
        Week2:[]
    }

    const extractTime = (shift:string, dayOffset:number) => {
        const time = shift.split(":");
        const result = new Date(WEEK_START);
        result.setDate(WEEK_START.getDate() + dayOffset);
        result.setHours(parseInt(time[0]));
        result.setMinutes(parseInt(time[1]));

        return result;
    }

    for (const day in schedule.Week1) {
        const dayNo = getDayNumber(day);
        schedule.Week1[day].forEach((shift:Shift) => {
            const start = extractTime(shift.start, dayNo);
            const end = extractTime(shift.end, dayNo);
            
            const formatted:ShiftOnDay = {
                'start': start,
                'end': end,
                'dayNo':dayNo
            };
            result.Week1.push(formatted);
        })
    }

    for (const day in schedule.Week2) {
        const dayNo = getDayNumber(day);
        schedule.Week2[day].forEach((shift:Shift) => {
            const start = extractTime(shift.start, dayNo);
            const end = extractTime(shift.end, dayNo);
            
            const formatted:ShiftOnDay = {
                'start': start,
                'end': end,
                'dayNo':dayNo
            };
            result.Week2.push(formatted);
        })
    }

    console.log("RESULT", result);
    return result;
}