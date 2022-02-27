import { Box, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import Analytics from './Analytics/Analytics';
import RequestTests from './Fetch/RequestTests';
import Router from './Router/RouterTests';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.defaultProps = {
  children: null,
};

function TestsPage() {
  const [tabNumber, setTabNumber] = useState(1);

  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setTabNumber(newValue);
    },
    [tabNumber]
  );

  return (
    <Box>
      <Toolbar/>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabNumber} onChange={handleChange} aria-label='basic tabs example'>
          <Tab label='Analytics' {...a11yProps(0)} />
          <Tab label='Requests' {...a11yProps(1)} />
          <Tab label='Hooks' {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={tabNumber} index={0}>
        <Analytics />
      </TabPanel>
      <TabPanel value={tabNumber} index={1}>
        <RequestTests />
      </TabPanel>
      <TabPanel value={tabNumber} index={2}>
        <Router />
      </TabPanel>
    </Box>
  );
}

export default TestsPage;
