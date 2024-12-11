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
import { Login } from './pages/LoginPage/LoginSheet';
import { Register } from './pages/Register';
import { Timesheet } from './pages/Timesheet';
import { useState, createContext } from 'react';
import { UserProvider } from './state/User';
import LoginPage from './pages/LoginPage/LoginPage';


function App() {
  return (
    <UserProvider>
    <MantineProvider theme={theme}>
      <div className = "App">
        <Router>
          <Routes>
            <Route path ="/" element = {<LoginPage />} /> 
            {/* <Route path ="/forgot-password" element = {<ForgotPassword />} /> 
            <Route path ="/register" element = {<Register />} /> 
            <Route path ="/" element = {<Home />} /> 
            <Route path ="/timesheet" element = {<Timesheet />} /> 
            <Route path="*" element = {<h1>Page Not Found</h1>} /> */}
          </Routes>
        </Router>
      </div>
    </MantineProvider>
    </UserProvider>
  );
}

export default App;
