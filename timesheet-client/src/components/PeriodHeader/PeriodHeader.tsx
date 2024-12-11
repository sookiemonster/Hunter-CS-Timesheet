import React, { useContext, useEffect, useMemo, useState } from 'react';
import PayrollPeriod, { NULL_PERIOD } from './PayrollPeriod';
import { Menu, Loader, Group, Stack, Space } from '@mantine/core';
import './styles.css'
import { useFetchLocal } from '../../state/hooks';
import { ControlContext } from '../../state/Control.tsx/ControlContext';
import { relative } from 'path';

interface PeriodHeaderProps {
    period_no?:number
    font_size?: 'small' | 'large',
    show_current?:Boolean
}

interface PeriodSelectorProps {
    size:'small' | 'large',
}

function PeriodSelector({size}:PeriodSelectorProps):JSX.Element {
    const { selectPeriod } = useContext(ControlContext);
    const { data:allPeriods, loading:allPeriodsLoading, error:allPeriodsError, refetch:allPeriodsRefetch, abort:allAbort } = useFetchLocal<PayrollPeriod[]>(
      "/periods/getCurrentPeriod"
    );

    const maxPerColumn = 4;
    const columnPx = 50;

    return <Menu shadow='md' width={`${columnPx * maxPerColumn + 5 * maxPerColumn}`}>
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
            gridTemplateColumns: `repeat(${maxPerColumn}, ${columnPx}px)`, // Two equal-width columns
          }}
          >
          { allPeriods 
              ? allPeriods.map((item, index) => {
                  return <Menu.Item onClick={() => selectPeriod(item)} className='selector-item' component='div' key={index}>{item.period_id}</Menu.Item>
              })
              : <Loader />
        }
        </div>
      </Menu.Dropdown>
    </Menu>
}

function PeriodHeader({period_no, font_size, show_current}:PeriodHeaderProps):JSX.Element {
    // Defualts & utils
    const render_size = (font_size == 'small') ? "small" : "large";
    const stringifyDate = (s:string) => { 
      const d = new Date(s);
      return d.toLocaleString('default', { month: 'long', day:"numeric", year: 'numeric' }) 
    }

    // Data & state
    const { selectedPeriod, selectPeriod } = useContext(ControlContext);
    const { data:currentPeriod } = useFetchLocal<PayrollPeriod[]>("/periods/getCurrentPeriod");

    useEffect(()=> {
      if (selectedPeriod !== NULL_PERIOD) { return; }
      if (!currentPeriod) { return; }
      selectPeriod(currentPeriod[0]);
    }, [currentPeriod, selectedPeriod])

    console.log(selectedPeriod)

    return (
        <div className={'period-container ' + render_size}>
          { (selectedPeriod !== NULL_PERIOD) 
            ? <>
              <span className={render_size}>
                  { show_current && selectedPeriod.is_current ? "Currently, " : "" }
                  <b>{ stringifyDate(selectedPeriod.start_time) } - { stringifyDate(selectedPeriod.end_time) }</b>
              </span>
              <h1 className={render_size}>Payroll&nbsp;	
                  <Group style={{display: 'inline-flex'}}>
                      Period #{ selectedPeriod.period_id }
                      <PeriodSelector size={render_size} />
                  </Group>
              </h1>
              </>
            : <Stack>
              <Loader style={{ position: 'relative', top:-20 }}size={50} color='softpurple.4'/>
              </Stack>
            }
        </div>
    )
}

export default PeriodHeader;