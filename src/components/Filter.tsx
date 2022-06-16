import React, { SyntheticEvent, useContext, useState } from 'react';
import { Box, Button, Collapse, Toolbar } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useLocation } from 'react-router-dom';
import { SearchContext } from '../Context/SearchContext';
import FilterCheckboxes from './FilterCheckboxes';
import { logAdminExternal } from '../utils/logging';
import { GlobalContext } from '../Context/GlobalContext';
import SizeSlider from './SizeSlider';
import { LoggingContext } from '../Context/LoggingContext/LoggingContext';

function UpdateResultsButton() {
  const {
    updateResults,
    // initialFilteredPostsObjects,
    fetchedPosts,
    filterState,
  } = useContext(SearchContext);
  const [resultsUpToDate, setResultsUpToDate] = useState(true);

  // Update state to determine whether Update Results button is disabled
  React.useEffect(() => {
    const { externalFilteredPosts, internalFilteredPosts } = filterState;
    logAdminExternal({
      location: 'resultsUpToDate USEEFFECT',
      externalFilteredPoststimestamp: filterState.timestamps.externalFilteredPosts,
      internalFilteredPoststimestamp: filterState.timestamps.internalFilteredPosts,
    });
    // We want to setResultsUpToDate(false) if there has been a change to the internalFilteredPosts that hasn't been updated in the externalFilteredPosts
    if (resultsUpToDate) {
      if (
        // First, check if externalFilteredPosts is the least recent. If so, the results may not be up to date.
        filterState.timestamps.externalFilteredPosts <
          filterState.timestamps.internalFilteredPosts &&
        // Second, check the post lengths are the different. If they are, the results are not up to date
        (externalFilteredPosts.length !== internalFilteredPosts.length ||
          // Third, iterate through the arrays to check if they are the different. If they are different, the results are not up to date and we want to setResultsUpToDate to false
          externalFilteredPosts.filter(
            (thisExtObj, index) => thisExtObj.commentId !== internalFilteredPosts[index].commentId
          ).length !== 0)
      ) {
        setResultsUpToDate(false);
      }
      // else if resultsUpToDate === false, then we need to check if we want to setResultsUpToDate(true); ie, are the results now up to date?
    } else if (
      // The results are up to date if the lengths are the same and the filters match
      externalFilteredPosts.length === internalFilteredPosts.length &&
      // Third, iterate through the arrays to check if they are the different. If they are different, the results are not up to date and we want to setResultsUpToDate to false
      externalFilteredPosts.filter(
        (thisExtObj, index) => thisExtObj.commentId !== internalFilteredPosts[index].commentId
      ).length === 0
    ) {
      setResultsUpToDate(true);
    }
  }, [filterState.timestamps.externalFilteredPosts, filterState.timestamps.internalFilteredPosts]);

  return (
    <Button
      sx={{ position: 'fixed', zIndex: 900 }}
      color={resultsUpToDate ? 'success' : 'secondary'}
      disabled={resultsUpToDate}
      onClick={updateResults}
      variant='contained'
    >
      {`${resultsUpToDate ? 'Results Up To Date' : `Update Results`} ${
        Object.keys(filterState.internalFilteredPosts).length
      }/${Object.keys(fetchedPosts).length}`}
    </Button>
  );
}

function Filter({ origin }: { origin: string }) {
  const location = useLocation();
  const { filterState, dispatchFilter } = useContext(SearchContext);
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
    addLog(`Clicked filter dropdown button for: ${label}`, location.pathname);
    setDropDownOpen((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  return (
    <Box>
      <Toolbar />
      {/* <br /> */}
      <Box sx={{ justifyContent: 'center', display: 'flex', marginTop: '4px' }}>
        <UpdateResultsButton />
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
        <Box sx={{ textAlign: 'center', color: "gray" }}>
          <span>(This feature isn&apos;t ready yet)</span>
        </Box>
        {/* <FilterCheckboxes
          filterLabel='styles'
          filterObject={filterState.filterCheckboxObjects.styles}
          dispatchFilter={dispatchFilter}
        /> */}
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
      {/* <Button // Color Season Checkboxes
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
      </Collapse> */}
    </Box>
  );
}

export default Filter;
