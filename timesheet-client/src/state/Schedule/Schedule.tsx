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

export function responseToCalendar() {
    // WHAT WHO USES 0-indexing for months???
    const WEEK_START = new Date(2020,0,26);
    console.log(WEEK_START);
    return "";
}