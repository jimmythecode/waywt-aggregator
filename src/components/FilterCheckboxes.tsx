import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Divider,
  FormControlLabel,
  FormGroup,
  TextField,
} from '@mui/material';
import Fuse from 'fuse.js';
import React, { SyntheticEvent, useContext, useState } from 'react';
import { LoggingContext } from '../Context/LoggingContext';
import {
  FilterAction,
  FilterObjectCheckbox,
  FilterTypeLabelsCheckbox,
} from '../Reducers/filterReducer';
import FilterCheckbox from './FilterCheckbox';

function FilterCheckboxes({
  filterObject,
  dispatchFilter,
  filterLabel,
}: {
  filterObject: FilterObjectCheckbox;
  dispatchFilter: React.Dispatch<FilterAction>;
  filterLabel: FilterTypeLabelsCheckbox;
}) {
  // const { updateFilterUpdateTimestamps } = useContext(SearchContext);
  const { addLog } = useContext(LoggingContext);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textSearchInputState, setTextSearchInputState] = useState('');
  const [arrayOfFilteredCheckboxLabels, setArrayOfFilteredCheckboxLabels] = useState<string[]>([]);

  // Initialise fuzzy search object
  const fuse = React.useMemo(() => new Fuse(Object.keys(filterObject)), [filterObject]);
  // Fuzzy search with input to filter results
  React.useEffect(() => {
    // Set debounce to improve performance
    const delayDebounceFn = setTimeout(() => {
      if (textSearchInputState.length === 0) {
        setArrayOfFilteredCheckboxLabels(Object.keys(filterObject));
      } else if (textSearchInputState.length > 0) {
        setArrayOfFilteredCheckboxLabels(
          fuse.search(textSearchInputState).map((thisFuseResult) => thisFuseResult.item)
        );
      }
    }, 250);
    return () => clearTimeout(delayDebounceFn);
  }, [textSearchInputState]);

  return (
    <FormGroup sx={{ marginLeft: '16px' }}>
      <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: '1fr 90px' }}>
        <Box sx={{display: "flex"}}>
        <Collapse in={!showTextInput} orientation='horizontal' >
          <FormControlLabel // Select all checkbox
            sx={{
              display: !showTextInput ? 'auto' : 'none', whiteSpace: "nowrap"
            }}
            control={
              <Checkbox // select all checkbox
                checked={!Object.values(filterObject).some((x) => x.checked === false)}
                onChange={(event: SyntheticEvent<Element, Event>, checked: boolean) => {
                  addLog(`Clicked Checkbox for '${'Select All'}'`);
                  dispatchFilter({
                    type: 'click select all checkbox',
                    filterLabel,
                    checked,
                  });
                }}
                name='Select All'
              />
            }
            label='Select All'
          />
          </Collapse>
          <Collapse in={showTextInput} orientation='horizontal'>
            <TextField // Search text input
              id='checkbox-search-textfield'
              label='Search for tags'
              variant='outlined'
              value={textSearchInputState}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setTextSearchInputState(event.target.value)
              }
            />
          </Collapse>
        </Box>
        <Button // Text/Select All Button Toggle
          onClick={() => {
            setTextSearchInputState('');
            setShowTextInput((prev) => !prev);
          }}
          variant='outlined'
          size='small'
          sx={{
            width: '80px',
          }}
        >
          {!showTextInput ? 'Text Search' : 'Select All'}
        </Button>
      </Box>
      <Divider // Separates Select All Checkbox from other Checkboxes
      />
      {arrayOfFilteredCheckboxLabels.map((thisLabel) => (
        <FilterCheckbox thisLabel={thisLabel} key={thisLabel} filterLabel={filterLabel} />
      ))}
    </FormGroup>
  );
}

export default FilterCheckboxes;
