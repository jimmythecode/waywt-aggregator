import { SnackbarProvider } from 'notistack';
import React from 'react';
import Drawer from './Drawer';
import RequestTests from './RequestTests';

function App() {
  return (
    <SnackbarProvider maxSnack={5}>
      <div className='App'>
        <h1>WAYWT</h1>
        <Drawer />
        <RequestTests />
      </div>
    </SnackbarProvider>
  );
}

export default App;
