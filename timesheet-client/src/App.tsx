import React from 'react';
// import logo from './logo.svg';
import './App.css';
import PeriodHeader from './components/PeriodHeader';
import { MantineProvider } from '@mantine/core';
import theme from './Theme';
import Navbar from './components/Navbar';
import { SAMPLE_USER } from './state/sample';
// import { ApproveButton, ArrowButton, SubmitButton } from './components/Buttons';
import BoxedStat from './components/Stats';
import LandingPage from './pages/LandingPage/LandingPage';

function App() {
  return (
    
    <MantineProvider theme={theme}>
      <div className="App">
        <Navbar user={SAMPLE_USER} initial_active={0}/>
        <LandingPage user={SAMPLE_USER} />
        {/* <PeriodHeader show_current={false} font_size={'large'}/> */}
      </div>
    </MantineProvider>
  );
}

export default App;
