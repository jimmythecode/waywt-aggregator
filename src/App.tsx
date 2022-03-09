import { SnackbarProvider } from 'notistack';
import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import { Route, Routes, useLocation } from 'react-router-dom';
import TestsPage from './pages/TestsPage/TestsPage';
import { logAdminExternal } from './utils/logging';
import SearchPage from './pages/SearchPage/SearchPage';
import NavBar from './components/NavBar';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import GlobalContext from './Context/GlobalContext';
import UserContext from './Context/UserContext';
import LoggingContextProvider from './Context/LoggingContext';

// Google Analytics set up
const googleAnalyticsTrackingCode = process.env.REACT_APP_GA_TRACKING_CODE3;
logAdminExternal({
  googleAnalyticsTrackingCode,
  rest: process.env,
});
if (typeof googleAnalyticsTrackingCode === 'string') {
  ReactGA.initialize(googleAnalyticsTrackingCode, {
    // debug: true,
    titleCase: false,
  });
} else throw new Error('THERE IS NO ENV VARIABLE FOR GOOGLE ANALYTICS');

function App() {
  const location = useLocation();

  // Google Analytics to send data on each page change
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, [location.pathname]);

  return (
    <SnackbarProvider maxSnack={5}>
      <LoggingContextProvider>
        <GlobalContext>
          <UserContext>
            <NavBar />
            <Routes>
              <Route path='/' element={<SearchPage />} />
              <Route path='/tests' element={<TestsPage />} />
              <Route path='/settings' element={<SettingsPage />} />
            </Routes>
          </UserContext>
        </GlobalContext>
      </LoggingContextProvider>
    </SnackbarProvider>
  );
}

export default App;
