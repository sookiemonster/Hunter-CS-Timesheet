import React from 'react';
// import logo from './logo.svg';
import './App.css';
import PeriodHeader from './components/PeriodHeader';
import { MantineProvider } from '@mantine/core';
import theme from './Theme';
import Navbar from './components/Navbar';
import { SAMPLE_USER } from './state/sample';
import { ApproveButton, ArrowButton, SubmitButton } from './components/Buttons';
import BoxedStat from './components/Stats';

//routing imports 
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';

function App() {
  return (
    <div className = "App">
      <Router>
        <Routes>
          <Route path ="/" element = {<Login />} /> 
          <Route path ="/Home" element = {<Home />} /> 
          <Route path="*" element = {<h1>Page Not Found</h1>} />
        </Routes>
      </Router>
    </div>
    

  /*
    <MantineProvider theme={theme}>
      <div className="App">
        <Navbar user={SAMPLE_USER} initial_active={1}/>
        <ApproveButton/>
        <SubmitButton/>
        <BoxedStat size='big' variant='box' stat='13' label='Total Hours Worked'/>
        <ArrowButton direction='left'/>
        {/* <PeriodHeader show_current={false} font_size={'large'}/> }
      </div>
    </MantineProvider>
  */
  );
}

export default App;
