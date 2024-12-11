import PeriodHeader from '../components/PeriodHeader';
import theme from '../Theme';
import Navbar from '../components/Navbar';
import { SAMPLE_USER } from '../state/sample';
import BoxedStat from '../components/Stats';

import { useContext } from "react";
import { UserContext } from '../state/User';

export const Timesheet = () =>{
  const { role } = useContext(UserContext)
  return <>{role}</>
};