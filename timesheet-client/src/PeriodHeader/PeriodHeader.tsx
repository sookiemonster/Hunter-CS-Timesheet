import React, { useEffect, useMemo, useState } from 'react';
import PayrollPeriod, { NULL_PERIOD } from './PayrollPeriod';
import './style.css'

interface PeriodHeaderProps {
    period_no?:number
    font_size?:string,
    show_current?:Boolean
}

function PeriodHeader({period_no, font_size, show_current}:PeriodHeaderProps):JSX.Element {
    const default_size = '1rem';
    font_size = font_size || default_size;
    
    const [isLoading, setIsLoading] = useState(true);
    const [period, setPeriod] = useState(NULL_PERIOD);

    const allPeriods = useMemo(() => {
        // getAllPeriods();
        return [1,2,3,4,5,6,7,8,9,10,11];
    }, []);
    
    useEffect(() => {
        // Get current period on load, if not provided
        
        if (period_no) {
            // rendered_period = await getPeriod(period_no);
        }

        // const rendered_period = await getCurrentPeriod();
        // period_no =
        const rendered_period:PayrollPeriod = {
            period_no: 8,
            start: new Date("10/06/2024"),
            end: new Date("10/06/2024"),
            is_current: true
        }
        setPeriod(rendered_period);
        setIsLoading(false);

    }, [period_no]);

    return (
        <div className='period-container'>
            { show_current && period.is_current ? "Currently, " : "" }
            <span>
            { period.start.toLocaleString('default', { month: 'long' }) }
            to 
            { period.end.toLocaleString('default', { month: 'long' }) }
            </span>
            <span>
                Payroll Period #{ period.period_no }
            </span>
            <div>DropDown</div>
        </div>
    )
}

export default PeriodHeader;