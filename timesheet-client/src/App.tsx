import React from 'react';
// import logo from './logo.svg';
import './App.css';
import PeriodHeader from './PeriodHeader';
import { MantineProvider } from '@mantine/core';
import theme from './Theme';

function App() {
  return (
    
    <MantineProvider theme={theme}>
      <div className="App">
        <PeriodHeader show_current={true} font_size={'small'}/>
      </div>
    </MantineProvider>
  );
}

export default App;
