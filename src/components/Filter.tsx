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

function Filter({origin}: {origin:string}) {
  const {
    updateResults,
    styleFilterObject,
    setStyleFilterObject,
    filteredPostsInternal,
    resultsUpToDate,
    initialFilteredPostsObjects,
  } = useContext(SearchContext);
  const { filterMobileOpen } = React.useContext(GlobalContext);
  const { updateLog } = useContext(LoggingContext);
  const [dropDownOpen, setDropDownOpen] = useState(true);

  // I want filterMobileOpen in state so that filter still renders when I slide window width back and forth
  const doNothing = ()=> "nothing"
  if (filterMobileOpen){doNothing()}

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
            Object.keys(filteredPostsInternal).length
          }/${Object.keys(initialFilteredPostsObjects).length}`}
        </Button>
      </Box>
      <br />
      <br />
      <Button
        sx={{ width: '100%' }}
        endIcon={<ArrowDropDownIcon />}
        onClick={() => setDropDownOpen((prev) => !prev)}
      >
        Styles
      </Button>
      <Collapse in={dropDownOpen}>
          <FilterCheckboxes/>
      </Collapse>
      </Box>
    );
}

export default Filter;
