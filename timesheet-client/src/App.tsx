import React, { useContext } from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';

import { UserProvider } from './state/User';
import { ControlProvider } from './state/Control.tsx/ControlContext';

import theme from './Theme';
import Navbar from './components/Navbar';

//routing imports 
import { ForgotPassword } from './pages/ForgotPassword';

import LandingPage from './pages/LandingPage/LandingPage';
import TimesheetPage from './pages/TimesheetPage';
import EmployeePage from './pages/EmployeePage';

function App() {
  return (
    <UserProvider>
      <ControlProvider>
        <MantineProvider theme={theme}>
          <div className = "App">
            <Router>
              <Navbar />
              <Routes>
                <Route path ="/" element = {<LandingPage />} /> 
                <Route path ="/forgot-password" element = {<ForgotPassword />} /> 
                {/* <Route path ="/register" element = {<Register />} />  */}
                <Route path ="/employees" element = {<EmployeePage />} /> 
                <Route path ="/timesheets" element = {<TimesheetPage />} /> 
                <Route path="*" element = {<h1>Page Not Found</h1>} />
              </Routes>
            </Router>
          </div>
        </MantineProvider>
      </ControlProvider>
    </UserProvider>
  );
}

export default App;
