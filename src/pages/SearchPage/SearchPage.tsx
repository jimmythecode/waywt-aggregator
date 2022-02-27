import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import { GlobalContext } from '../../Context/GlobalContext';
import SearchResults from '../../components/SearchResults';
import Filter from '../../components/Filter';
import SearchContextProvider from '../../Context/SearchContext';

export default function SearchPage() {
  const { filterMobileOpen, setFilterMobileOpen } = React.useContext(GlobalContext);
  // const [mobileOpen, setMobileOpen] = React.useState(false);

  const drawerWidth = 350;
  const handleDrawerToggle = () => {
    setFilterMobileOpen(!filterMobileOpen);
  };

  return (
    <SearchContextProvider>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Box // The panel containing the filter options
          component='nav'
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
          aria-label='mailbox folders'
        >
          {/* Drawer with filter if narrow screen */}
          <Drawer
            // container={container}
            variant='temporary'
            open={filterMobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            <Filter />
          </Drawer>
          {/* Drawer with filter if wide screen */}
          <Drawer
            variant='permanent'
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            <Filter />
          </Drawer>
        </Box>
        <Box // The main section containing results
          component='main'
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            backgroundColor: '#E7EBF0',
          }}
        >
          {/* I think the Toolbar takes up the space of the NavBar */}
          <Toolbar />
          <SearchResults />
        </Box>
      </Box>
    </SearchContextProvider>
  );
}
