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