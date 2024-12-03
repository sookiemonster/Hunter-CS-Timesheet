import React, { useEffect, useMemo, useState } from 'react';
import PayrollPeriod, { NULL_PERIOD } from './PayrollPeriod';
import { Menu, Button } from '@mantine/core';
import './styles.css'
import { render } from '@testing-library/react';
import { sep } from 'path';

interface PeriodHeaderProps {
    period_no?:number
    font_size?: 'small' | 'large',
    show_current?:Boolean
}

interface PeriodSelectorProps {
    periods:number[],
    size:'small' | 'large',
    select:any
}

function PeriodSelector({periods, size, select}:PeriodSelectorProps):JSX.Element {
    const half = Math.ceil(periods.length / 2); // Calculate the halfway point
    const firstColumn = periods.slice(0, half);
    const secondColumn = periods.slice(half);

    return <Menu shadow='md' width='110'>
    <Menu.Target>
        <div className={`open-selector ${size}`} >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <polygon points="0 0, 100 0, 50 100"/>
        </svg>
        </div>
      </Menu.Target>
      <Menu.Dropdown>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '50px 50px', // Two equal-width columns
          }}
          >
          {/* First Column */}
          <div>
            {firstColumn.map((item, index) => (
              <Menu.Item onClick={() => select(item)} className='selector-item' component='div' key={index}>{item}</Menu.Item>
            ))}
          </div>
          {/* Second Column */}
          <div>
            {secondColumn.map((item, index) => (
              <Menu.Item onClick={() => select(item)} className='selector-item' component='div' key={index}>{item}</Menu.Item>
            ))}
          </div>
        </div>
      </Menu.Dropdown>
    </Menu>
}

function PeriodHeader({period_no, font_size, show_current}:PeriodHeaderProps):JSX.Element {
    const render_size = (font_size == 'small') ? "small" : "large";
    
    const [isLoading, setIsLoading] = useState(true);
    const [period, setPeriod] = useState(NULL_PERIOD);

    const allPeriods = useMemo(() => {
        // getAllPeriods();
        return [1,2,3,4,5,6,7,8,9,10,11];
    }, []);

    const selectPeriod = (n:number) => {
      setIsLoading(true);
      const rendered_period:PayrollPeriod = {
        period_no: 7,
        start: new Date("10/4/2024"),
        end: new Date("10/4/2024"),
        is_current: true
      }
      // rendered_period = await getPeriod(period_no);
      // then...
      setPeriod(rendered_period);
      setIsLoading(false);
    }
    
    useEffect(() => {
        // Get current period on load, if not provided
        let rendered_period = NULL_PERIOD;
        if (period_no) {
            // rendered_period = await getPeriod(period_no);
        } else {
            // rendered_period = await getCurrentPeriod();
        }

        // period_no =
        rendered_period = {
            period_no: 8,
            start: new Date("10/06/2024"),
            end: new Date("10/06/2024"),
            is_current: true
        }
        setPeriod(rendered_period);
        setIsLoading(false);

    }, [period_no]);
    
    let stringifyDate = (date:Date) => {
        return date.toLocaleString('default', { month: 'long', day:"numeric", year: 'numeric' })
    }

    return (
        <div className={'period-container ' + render_size}>
            <span className={render_size}>
                { show_current && period.is_current ? "Currently, " : "" }
                <b>{ stringifyDate(period.start) } - { stringifyDate(period.end) }</b>
            </span>
            <h1 className={render_size}>Payroll Period #{ period.period_no }</h1>
            <PeriodSelector periods={allPeriods} size={render_size} select={selectPeriod} />
        </div>
    )
}

export default PeriodHeader;