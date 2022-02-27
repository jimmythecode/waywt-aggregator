import * as React from 'react';
import { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { GlobalContext } from '../Context/GlobalContext';
import { LoggingContext } from '../Context/LoggingContext';

function MiddleButtons() {
  const { filterMobileOpen, setFilterMobileOpen } = React.useContext(GlobalContext);
  const { updateLog } = useContext(LoggingContext);
  const navigate = useNavigate();
  return (
    <Box sx={{ flexGrow: 1, display: 'flex' }}>
      <Button
        sx={{
          color: 'white',
          display: 'block',
          fontSize: {
            xs: '10px',
            sm: '14px',
          },
        }}
        onClick={() => {
          navigate(`/`);
          updateLog('Clicked NavBar Logo');
        }}
      >
        WAYWT Aggregator
      </Button>
      <Button
        sx={{
          color: 'white',
          fontSize: {
            xs: '10px',
            sm: '14px',
          },
          display: {
            xs: 'block',
            md: 'none',
          },
        }}
        size='small'
        color='secondary'
        variant='contained'
        onClick={() => {
          updateLog('Clicked NavBar Open Filter Button');
          setFilterMobileOpen((prev) => !prev);
        }}
      >
        {filterMobileOpen ? 'Close' : 'Open'} Filter
      </Button>
    </Box>
  );
}

export default function NavBar() {
  const { updateLog } = useContext(LoggingContext);
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<Element | null>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: { currentTarget: Element }) => {
    setAnchorEl(event.currentTarget);
    updateLog('Clicked NavBar AccountCircle Menu Button')
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {/* <MenuItem onClick={handleMenuClose}>Profile</MenuItem> */}
      <MenuItem onClick={handleMenuClose}>
        <Link
          style={{ color: 'inherit', cursor: 'inherit', textDecoration: 'inherit' }}
          to='/settings'
        >
          Settings
        </Link>
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size='large'
          aria-label='account of current user'
          aria-controls='primary-search-account-menu'
          aria-haspopup='true'
          color='inherit'
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='fixed' sx={{ zIndex: 2000 }}>
        <Toolbar>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='open drawer'
            sx={{ mr: 2 }}
            onClick={() => updateLog('Clicked NavBar Menu Button')}
          >
            <MenuIcon />
          </IconButton>
          <MiddleButtons />

          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              size='large'
              edge='end'
              aria-label='account of current user'
              aria-controls={menuId}
              aria-haspopup='true'
              onClick={handleProfileMenuOpen}
              color='inherit'
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
