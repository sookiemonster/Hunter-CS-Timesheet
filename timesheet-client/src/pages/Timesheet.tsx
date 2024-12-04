//@ts-nocheck
//@ts-nocheck
import PeriodHeader from '../components/PeriodHeader';
import { MantineProvider } from '@mantine/core';
import theme from '../Theme';
import Navbar from '../components/Navbar';
import { SAMPLE_USER } from '../state/sample';
import { ApproveButton, ArrowButton, SubmitButton } from '../components/Buttons';
import BoxedStat from '../components/Stats';

export const Timesheet = () =>{
  return     <MantineProvider theme={theme}>
  <div className="App">
    <Navbar user={SAMPLE_USER} initial_active={1}/>
    <ApproveButton/>
    <SubmitButton/>
    <BoxedStat size='big' variant='box' stat='13' label='Total Hours Worked'/>
    <ArrowButton direction='left'/>
    {/* <PeriodHeader show_current={false} font_size={'large'}/>*/ }
  </div>
</MantineProvider>;
};