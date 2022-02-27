import { Checkbox, Divider, FormControlLabel, FormGroup } from '@mui/material';
import React, { SyntheticEvent, useContext } from 'react';
import { LoggingContext } from '../Context/LoggingContext';
import { SearchContext } from '../Context/SearchContext';
import FilterCheckbox from './FilterCheckbox';

function FilterCheckboxes() {
  const {
    styleFilterObject,
    setStyleFilterObject,
    // filteredPostsInternal,
    // resultsUpToDate,
    // initialFilteredPostsObjects,
    updateFilterUpdateTimestamps,
  } = useContext(SearchContext);
  const { updateLog } = useContext(LoggingContext);

  function numberOfResultsWithThisTag(thisLabel: string): number {
    // return initialFilteredPostsObjects.filter((thisObj) => thisObj.tags.includes(thisLabel)).length;
    return 1;
  }

  return (
    <FormGroup sx={{ marginLeft: '16px' }}>
      <FormControlLabel // Select all checkbox
        control={
          <Checkbox
            checked={!Object.values(styleFilterObject).some((x) => x.checked === false)}
            onChange={(event: SyntheticEvent<Element, Event>, checked: boolean) => {
              updateLog(`Clicked Checkbox for '${'Select All'}'`);
              updateFilterUpdateTimestamps('styleTags')
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
        <FilterCheckbox thisLabel={thisLabel} key={thisLabel} />
      ))}
    </FormGroup>
  );
}

export default FilterCheckboxes;
