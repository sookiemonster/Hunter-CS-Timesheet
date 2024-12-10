import React from 'react';
// import logo from './logo.svg';
import './App.css';
import PeriodHeader from './components/PeriodHeader';
import { MantineProvider, useSafeMantineTheme } from '@mantine/core';
import { CalendarModificationProvider } from './components/Calendar/CalendarModificationContext';

import theme from './Theme';
import Navbar from './components/Navbar';
import { SAMPLE_USER } from './state/sample';
// import { ApproveButton, ArrowButton, SubmitButton } from './components/Buttons';
import BoxedStat from './components/Stats';
import LandingPage from './pages/LandingPage/LandingPage';

//routing imports 
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Timesheet } from './pages/Timesheet';
import { useState, createContext } from 'react';
import { ForgotPassword } from './pages/ForgotPassword';
import TimesheetPage from './pages/TimesheetPage';
import { MouseHistoryProvider } from './components/Calendar/MouseHistoryContext';



//----Creating global context to hold all info want to pass fown---//
export const AppContext = createContext({

});


function App() {
  /* Create a state for the components so each one home, profile, contact can access the state */
  const [email, setEmail] = useState("");
  const [user, setUser] = useState({}); //empty obhect for now but meant to store firebase user info
  const [loginStatus, setloginStatus] = useState(null);
  return (
    <MantineProvider theme={theme}>
    <div className = "App">
      <Navbar user={SAMPLE_USER} initial_active={0}/>
        {/* <LandingPage user={SAMPLE_USER} /> */}
        <TimesheetPage user={SAMPLE_USER}/>

      <AppContext.Provider value={{email, setEmail, loginStatus, setloginStatus, user, setUser}}>
        {/* <Router>
          <Routes>
            <Route path ="/login" element = {<Login />} /> 
            <Route path ="/forgot-password" element = {<ForgotPassword />} /> 
            <Route path ="/register" element = {<Register />} /> 
            <Route path ="/" element = {<Home />} /> 
            <Route path ="/timesheet" element = {<Timesheet />} /> 
            <Route path="*" element = {<h1>Page Not Found</h1>} />
          </Routes>
        </Router> */}
      </AppContext.Provider>

      </div>
    </MantineProvider>
  );
}

export default App;
