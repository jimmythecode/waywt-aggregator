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
import React, { SyntheticEvent, useContext, useState } from 'react';
import { SearchContext } from '../Context/SearchContext';
import { LoggingContext } from '../Context/LoggingContext';

function Filter() {
  const {
    updateResults,
    styleFilterObject,
    setStyleFilterObject,
    filteredPostsInternal,
    resultsUpToDate,
    initialFilteredPostsObjects,
  } = useContext(SearchContext);
  const { updateLog } = useContext(LoggingContext);
  const [dropDownOpen, setDropDownOpen] = useState(true);

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
        <FormGroup sx={{ marginLeft: '16px' }}>
          <FormControlLabel // Select all checkbox
            control={
              <Checkbox
                checked={!Object.values(styleFilterObject).some((x) => x.checked === false)}
                onChange={(event: SyntheticEvent<Element, Event>, checked: boolean) => {
                  updateLog(`Clicked Checkbox for '${'Select All'}'`);
                  setStyleFilterObject((prev) => {
                    const returnObj = { ...prev };
                    Object.keys(prev).forEach((label) => {
                      returnObj[label].checked = checked;
                    });
                    return returnObj;
                  });
                }}
                name='Select All'
              />
            }
            label='Select All'
          />
          <Divider // Separates Select All Checkbox from other Checkboxes
          />
          {Object.keys(styleFilterObject).map((thisLabel) => (
            <FormControlLabel
              key={thisLabel}
              disabled={styleFilterObject[thisLabel].disabled}
              control={<Checkbox />}
              label={`${thisLabel} (${
                initialFilteredPostsObjects.filter((thisObj) => thisObj.tags.includes(thisLabel))
                  .length
              })`}
              checked={styleFilterObject[thisLabel].checked}
              onChange={(event: SyntheticEvent<Element, Event>, checked: boolean) => {
                updateLog(`Clicked Checkbox for '${thisLabel}'`);
                setStyleFilterObject((prev) => {
                  const returnObj = { ...prev };
                  returnObj[thisLabel].checked = checked;
                  return returnObj;
                });
              }}
            />
          ))}
        </FormGroup>
      </Collapse>
    </Box>
  );
}

export default Filter;
