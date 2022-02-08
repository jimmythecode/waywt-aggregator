import { SnackbarProvider } from 'notistack';
import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import { Route, Routes , Link, useLocation} from 'react-router-dom';
import TestsPage from './pages/Tests/TestsPage';
import Drawer from './components/Drawer';
import { logAdminExternal } from './utils/logging';

const googleAnalyticsTrackingCode = process.env.REACT_APP_GA_TRACKING_CODE;
logAdminExternal({
  googleAnalyticsTrackingCode,
  rest: process.env,
});
if (typeof googleAnalyticsTrackingCode === 'string') {
  ReactGA.initialize(googleAnalyticsTrackingCode);
} else throw new Error('THERE IS NO ENV VARIABLE FOR GOOGLE ANALYTICS');

function App() {
  const location = useLocation();


  useEffect(() => {
    logAdminExternal('page changed!');
    logAdminExternal(location);
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, [location.pathname]);

  return (
    <SnackbarProvider maxSnack={5}>
      <h1>WAYWT</h1>
      <nav>
        <Link to='/'>Home</Link> | <Link to='/drawer'>Drawer</Link>
      </nav>
      <Routes>
        <Route path='/' element={<TestsPage />} />
        <Route path='/drawer' element={<Drawer />} />
      </Routes>
    </SnackbarProvider>
  );
}

export default App;
