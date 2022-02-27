import { Checkbox, FormControlLabel } from '@mui/material';
import React, { useContext } from 'react';
import { LoggingContext } from '../Context/LoggingContext';
import { SearchContext } from '../Context/SearchContext';

function FilterCheckbox({ thisLabel }: { thisLabel: string }) {
  const {
    styleFilterObject,
    setStyleFilterObject,
    initialFilteredPostsObjects,
    updateFilterUpdateTimestamps,
  } = useContext(SearchContext);
  const { updateLog } = useContext(LoggingContext);
  const [localCheckedState, setLocalCheckedState] = React.useState(
    styleFilterObject[thisLabel].checked
  );
  const [debounceHappening, setDebounceHappening] = React.useState(false);
  const [numberOfTagInstances, setNumberOfTagInstances] = React.useState(0);

  React.useEffect(() => {
    // setStyleFilterObject((prev) => {
    //   const returnObj = { ...prev };
    //   returnObj[thisLabel].checked = localCheckedState;
    //   return returnObj;
    // });
    // function updateParentValue() {
    //   setStyleFilterObject((prev) => {
    //     const returnObj = { ...prev };
    //     returnObj[thisLabel].checked = localCheckedState;
    //     return returnObj;
    //   });
    // }
    // setDebounceHappening(true);
    // const delayDebounceFn = setTimeout(() => {
    //   setDebounceHappening(false);
    //   updateParentValue();
    // }, 1000);
    // return () => clearTimeout(delayDebounceFn);
  }, [localCheckedState]);

  React.useEffect(() => {
    async function numberOfResultsWithThisTag(thisLabelString: string): Promise<number> {
      return initialFilteredPostsObjects.filter((thisObj) => thisObj.tags.includes(thisLabelString))
        .length;
      // return 1
    }

    async function asyncFunction() {
      const numberOfResults = await numberOfResultsWithThisTag(thisLabel);
      setNumberOfTagInstances(numberOfResults);
    }

    asyncFunction();
  }, []);

  return (
    <FormControlLabel
      key={thisLabel}
      disabled={styleFilterObject[thisLabel].disabled}
      control={<Checkbox />}
      label={`${thisLabel} (${numberOfTagInstances})`}
      checked={styleFilterObject[thisLabel].checked}
      onChange={(event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
        updateLog(`Clicked Checkbox for '${thisLabel}'`);
        updateFilterUpdateTimestamps('styleTags');
        setStyleFilterObject((prev) => {
          const returnObj = { ...prev };
          returnObj[thisLabel].checked = checked;
          return returnObj;
        });
      }}
    />
  );
}

export default FilterCheckbox;
