import { Checkbox, FormControlLabel } from '@mui/material';
import React, { useContext } from 'react';
import { LoggingContext } from '../Context/LoggingContext';
import { SearchContext } from '../Context/SearchContext';

function FilterCheckbox({ thisLabel }: { thisLabel: string }) {
  const { styleFilterObject, setStyleFilterObject, initialFilteredPostsObjects } =
    useContext(SearchContext);
  const { addLog } = useContext(LoggingContext);
  const [localCheckedState, setLocalCheckedState] = React.useState(
    styleFilterObject[thisLabel].checked
  );
  const [debounceHappening, setDebounceHappening] = React.useState(false);

  function numberOfResultsWithThisTag(thisLabelString: string): number {
    return initialFilteredPostsObjects.filter((thisObj) => thisObj.tags.includes(thisLabelString))
      .length;
    // return 1
  }

//   React.useEffect(() => {
//     // function updateParentValue() {
//     //     setParentValue(value);
//     // }

//     setDebounceHappening(true);
//     const delayDebounceFn = setTimeout(() => {
//       setDebounceHappening(false);
//       //   updateParentValue();
//       setStyleFilterObject((prev) => {
//         const returnObj = { ...prev };
//         returnObj[thisLabel].checked = localCheckedState;
//         return returnObj;
//       });
//     }, 1000);

//     return () => clearTimeout(delayDebounceFn);
//   }, [localCheckedState]);

  return (
    <FormControlLabel
      key={thisLabel}
      disabled={styleFilterObject[thisLabel].disabled}
      control={<Checkbox />}
      label={`${thisLabel} (${numberOfResultsWithThisTag(thisLabel)})`}
      checked={localCheckedState}
      onChange={(event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
        addLog(`Clicked Checkbox for '${thisLabel}'`);
        setLocalCheckedState(checked);
      }}
    />
  );
}

export default FilterCheckbox;
