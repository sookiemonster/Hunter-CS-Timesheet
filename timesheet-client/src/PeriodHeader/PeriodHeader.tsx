import React, { useEffect, useMemo, useState } from 'react';
import PayrollPeriod, { NULL_PERIOD } from './PayrollPeriod';
import { Title } from '@mantine/core';
import './styles.css'

interface PeriodHeaderProps {
    period_no?:number
    font_size?: 'small' | 'large',
    show_current?:Boolean
}

function PeriodHeader({period_no, font_size, show_current}:PeriodHeaderProps):JSX.Element {
    const render_size = (font_size == 'small') ? "small" : "large";
    
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
    
    let stringify = (date:Date) => {
        return date.toLocaleString('default', { month: 'long', day:"numeric", year: 'numeric' })
    }

    return (
        <div className='period-container'>
            <span className={render_size}>
                { show_current && period.is_current ? "Currently, " : "" }
                <b>{ stringify(period.start) } - { stringify(period.end) }</b>
            </span>
            <h1 className={render_size}>Payroll Period #{ period.period_no }</h1>
            <div>DropDown</div>
        </div>
    )
}

export default PeriodHeader;