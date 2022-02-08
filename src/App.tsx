import { SnackbarProvider } from 'notistack';
import React from 'react';
// import Drawer from './components/Drawer';
import TestsPage from './pages/Tests/TestsPage';

function App() {
  return (
    <SnackbarProvider maxSnack={5}>
      <div className='App'>
        <h1>WAYWT</h1>
        <TestsPage/>
        {/* <Drawer /> */}
      </div>
    </SnackbarProvider>
  );
}

export default App;
