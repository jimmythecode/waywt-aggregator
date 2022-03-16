import React, { SyntheticEvent, useContext, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Divider,
  FormControlLabel,
  FormGroup,
  Toolbar,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { SearchContext } from '../Context/SearchContext';
import { LoggingContext } from '../Context/LoggingContext';
import FilterCheckboxes from './FilterCheckboxes';
import { logAdminExternal } from '../utils/logging';
import { GlobalContext } from '../Context/GlobalContext';
import SizeSlider from './SizeSlider';

function Filter({ origin }: { origin: string }) {
  const {
    updateResults,
    resultsUpToDate,
    initialFilteredPostsObjects,
    filterState,
    dispatchFilter,
  } = useContext(SearchContext);
  const { filterMobileOpen } = React.useContext(GlobalContext);
  const { addLog } = useContext(LoggingContext);
  const [dropDownOpen, setDropDownOpen] = useState({
    styles: false,
    users: false,
    colorSeasons: false,
    sliders: false,
    bodyType: false,
  });

  // I want filterMobileOpen in state so that filter still renders when I slide window width back and forth
  const doNothing = () => 'nothing';
  if (filterMobileOpen) {
    doNothing();
  }

  function clickDropdownButton(label: 'styles' | 'users' | 'colorSeasons' | 'sliders') {
    addLog(`Clicked filter dropdown button for: ${label}`);
    setDropDownOpen((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  return (
    <Box>
      <Toolbar />
      {/* <br /> */}
      <Box sx={{ justifyContent: 'center', display: 'flex', marginTop: '4px' }}>
        <Button
          sx={{ position: 'fixed', zIndex: 1000 }}
          color={resultsUpToDate ? 'success' : 'secondary'}
          onClick={updateResults}
          variant='contained'
        >
          {`${resultsUpToDate ? 'Results Up To Date' : `Update Results`} ${
            Object.keys(filterState.internalFilteredPosts).length
          }/${Object.keys(initialFilteredPostsObjects).length}`}
        </Button>
      </Box>
      <br />
      <br />
      <Button // Style Checkboxes
        sx={{ width: '100%' }}
        endIcon={<ArrowDropDownIcon />}
        onClick={() => clickDropdownButton('styles')}
      >
        Styles
      </Button>
      <Collapse in={dropDownOpen.styles}>
        <FilterCheckboxes
          filterLabel='styles'
          filterObject={filterState.filterCheckboxObjects.styles}
          dispatchFilter={dispatchFilter}
        />
      </Collapse>
      <Button // User Checkboxes
        sx={{ width: '100%' }}
        endIcon={<ArrowDropDownIcon />}
        onClick={() => clickDropdownButton('users')}
      >
        Users
      </Button>
      <Collapse in={dropDownOpen.users}>
        <FilterCheckboxes
          filterLabel='users'
          filterObject={filterState.filterCheckboxObjects.users}
          dispatchFilter={dispatchFilter}
        />
      </Collapse>
      <Button // Color Season Checkboxes
        sx={{ width: '100%' }}
        endIcon={<ArrowDropDownIcon />}
        onClick={() => clickDropdownButton('colorSeasons')}
      >
        Color Seasons
      </Button>
      <Collapse in={dropDownOpen.colorSeasons}>
        <FilterCheckboxes
          filterLabel='colorSeasons'
          filterObject={filterState.filterCheckboxObjects.colorSeasons}
          dispatchFilter={dispatchFilter}
        />
      </Collapse>
      <Button // Color Season Checkboxes
        sx={{ width: '100%' }}
        endIcon={<ArrowDropDownIcon />}
        onClick={() => clickDropdownButton('sliders')}
      >
        Sizes
      </Button>
      <Collapse in={dropDownOpen.sliders}>
        <SizeSlider
          filterLabel='height'
          filterObject={filterState.filterSliderObjects.height}
          dispatchFilter={dispatchFilter}
          dropdownOpen={dropDownOpen.sliders}
        />
        <SizeSlider
          filterLabel='chest'
          filterObject={filterState.filterSliderObjects.chest}
          dispatchFilter={dispatchFilter}
          dropdownOpen={dropDownOpen.sliders}
        />
        <SizeSlider
          filterLabel='waist'
          filterObject={filterState.filterSliderObjects.chest}
          dispatchFilter={dispatchFilter}
          dropdownOpen={dropDownOpen.sliders}
        />
      </Collapse>
    </Box>
  );
}

export default Filter;
