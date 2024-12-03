//COMMENTED OUT turn TS into JS 
/*
import React from 'react';
// import logo from './logo.svg';
import './App.css';
import PeriodHeader from './components/PeriodHeader';
import { MantineProvider } from '@mantine/core';
import theme from './Theme';
import Navbar from './components/Navbar';
import { SAMPLE_USER } from './state/sample';

function App() {
  return (
    
    <MantineProvider theme={theme}>
      <div className="App">
        <Navbar user={SAMPLE_USER} initial_active={1}/>
        
      </div>
    </MantineProvider>
  );
}

export default App;
*/
import React from 'react';
import './App.css';
import { Auth } from "./components/auth";

function App() {
  return (
    
    <div className="App">
      {/* importing auth component*/} 
      <Auth />



      
        <header className="App-header">
        <h1>Welcome to React, testing Firebase</h1>
        <p>Edit <code>src/App.js</code> and save to reload.</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;


