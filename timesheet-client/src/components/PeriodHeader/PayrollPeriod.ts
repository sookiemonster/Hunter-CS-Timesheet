export default interface PayrollPeriod {
    period_no:number,
    start:Date,
    end:Date,
    is_current:Boolean
};

export const NULL_PERIOD:PayrollPeriod = {
    period_no: -1,
    start: new Date(),
    end: new Date(),
    is_current: false
};