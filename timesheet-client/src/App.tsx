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
        <PeriodHeader show_current={false} font_size={'large'}/>
      </div>
    </MantineProvider>
  );
}

export default App;
