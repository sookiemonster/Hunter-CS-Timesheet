export default interface PayrollPeriod {
    period_id: number,
    start_time: Date,
    end_time: Date,
    ts_due_start: Date,
    ts_due_end: Date,
};

export const NULL_PERIOD:PayrollPeriod = {
    period_id: 0,
    start_time: new Date(),
    end_time: new Date(),
    ts_due_start: new Date(),
    ts_due_end: new Date(),
};