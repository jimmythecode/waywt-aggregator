import { Checkbox, FormControlLabel } from '@mui/material';
import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { LoggingContext } from '../Context/LoggingContext/LoggingContext';
import { SearchContext } from '../Context/SearchContext';
import { FilterTypeLabelsCheckbox } from '../Reducers/filterReducer';
import { logAdminExternal } from '../utils/logging';

function FilterCheckbox({
  thisLabel,
  filterLabel,
}: {
  thisLabel: string;
  filterLabel: FilterTypeLabelsCheckbox;
}) {
  const location = useLocation();
  const {
    fetchedPosts,
    filterState,
    dispatchFilter,
  } = useContext(SearchContext);
  const { addLog } = useContext(LoggingContext);
  const filterStateChecked = filterState.filterCheckboxObjects[filterLabel][thisLabel].checked;
  const [localCheckedState, setLocalCheckedState] = React.useState(filterStateChecked);
  const [numberOfTagInstances, setNumberOfTagInstances] = React.useState(0);

  // Debounce update to filterState from local checked state
  React.useEffect(() => {
    function updateWhenCheckboxClicked() {
      if (filterStateChecked === localCheckedState) {
        return;
      }
      dispatchFilter({
        type: 'click single checkbox',
        filterLabel,
        checkboxLabel: thisLabel,
        checked: localCheckedState,
      });
    }
    const delayDebounceFn = setTimeout(() => {
      updateWhenCheckboxClicked();
    }, 100);
    return () => clearTimeout(delayDebounceFn);
  }, [localCheckedState]);

  // Update local state when global state changes (ie if we click Select All)
  React.useEffect(() => {
    function updateWhenCheckboxClicked() {
      if (filterStateChecked === localCheckedState) {
        return;
      }
      setLocalCheckedState(filterStateChecked);
    }
    const delayDebounceFn = setTimeout(() => {
      updateWhenCheckboxClicked();
    }, 100);
    return () => clearTimeout(delayDebounceFn);
  }, [filterStateChecked]);

  // Update the number of results for this checkbox
  React.useEffect(() => {
    async function numberOfResultsWithThisTag(thisLabelString: string): Promise<number> {
      if (filterLabel === 'styles') {
        return fetchedPosts.filter((thisObj) =>
        thisObj.tags !== undefined && thisObj.tags.includes(thisLabelString)
        ).length;
      } if (filterLabel === 'users') {
        return fetchedPosts.filter((thisObj) => thisObj.author === thisLabelString)
          .length;
      }  if (filterLabel === 'colorSeasons') {
        return fetchedPosts.filter((thisObj) => thisObj.season === thisLabelString)
          .length;
      } return 0
    }
    // get and set the number of results
    async function asyncFunction() {
      const numberOfResults = await numberOfResultsWithThisTag(thisLabel);
      setNumberOfTagInstances(numberOfResults);
    }
    // fire the above function
    asyncFunction();
  }, []);

  return (
    <FormControlLabel
      key={thisLabel}
      disabled={filterState.filterCheckboxObjects[filterLabel][thisLabel].disabled}
      control={<Checkbox />}
      label={`${filterLabel === "users" ? "u/" : ""}${thisLabel} (${numberOfTagInstances})`}
      checked={localCheckedState}
      onChange={(event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
        addLog(`Clicked Checkbox for '${thisLabel}'`, location.pathname);
        setLocalCheckedState(checked);
      }}
    />
  );
}

export default FilterCheckbox;
