import {
  Box,
  FormControlLabel,
  FormGroup,
  Slider,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { LoggingContext } from '../Context/LoggingContext';
import { UserContext } from '../Context/UserContext';
import { FilterAction, FilterObjectSlider } from '../Reducers/filterReducer';

const initialValues = {
  height: [140, 240],
  waist: [40, 160],
  chest: [40, 160],
};

function SizeSlider({
  filterLabel,
  filterObject,
  dispatchFilter,
  dropdownOpen,
}: {
  filterLabel: 'height' | 'waist' | 'chest';
  filterObject: FilterObjectSlider;
  dispatchFilter: React.Dispatch<FilterAction>;
  dropdownOpen: boolean;
}) {
  const { userDetails } = useContext(UserContext);
  const { addLog } = useContext(LoggingContext);
  const [value, setValue] = React.useState<number[]>([filterObject.min, filterObject.max]);
  const [disabledState, setDisabledState] = React.useState(filterObject.disabled);
  const [tooltipOpenState, setTooltipOpenState] = React.useState(false);

  // Close tooltip after a short time
  useEffect(() => {
    // If we just opened the dropdown, then show the tooltip
    if (dropdownOpen && tooltipOpenState === false && disabledState) {
      setTooltipOpenState(true);
    } else if (!dropdownOpen && tooltipOpenState === true) {
      setTooltipOpenState(false);
    }
    if (!disabledState) {
      setTooltipOpenState(false);
    }

    const timer1 = setTimeout(() => {
      if (dropdownOpen) {
        setTooltipOpenState(false);
      }
    }, 2000);
    return () => {
      clearTimeout(timer1);
    };
  }, [dropdownOpen, disabledState]);

  // Debounce update to filterState from local state
  React.useEffect(() => {
    function updateWhenCheckboxClicked() {
      // Return out if local state matches filterState
      if (filterObject.min === value[0] && filterObject.max === value[1]) return;

      dispatchFilter({
        type: 'update slider',
        filterLabel,
        min: value[0],
        max: value[1],
      });
    }
    const delayDebounceFn = setTimeout(() => {
      updateWhenCheckboxClicked();
    }, 150);
    return () => clearTimeout(delayDebounceFn);
  }, [value[0], value[1]]);

  // Debounce disable/enable slider from local state
  React.useEffect(() => {
    function updateWhenCheckboxClicked() {
                    if (!disabledState) {
                      // If we enable slider (disabledState=false), then update slider: 
                      dispatchFilter({
                        type: 'update slider',
                        filterLabel,
                        min: value[0],
                        max: value[1],
                      });
                    } else {
                      dispatchFilter({
                        type: 'disable slider',
                        filterLabel,
                      });
                    }
    }
    const delayDebounceFn = setTimeout(() => {
      updateWhenCheckboxClicked();
    }, 100);
    return () => clearTimeout(delayDebounceFn);
  }, [disabledState]);

  return (
    <Box sx={{ width: '80%', margin: 'auto' }}>
      <br />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          id={`input-slider-${filterLabel}`}
          variant='subtitle2'
          gutterBottom
          sx={{ textTransform: 'capitalize', alignSelf: 'center', fontWeight: 'bold' }}
        >
          {`${filterLabel}: (${value[0]}-${value[1]})`}
        </Typography>
        <FormGroup>
          <Tooltip placement='bottom' title='Click to enable slider' open={tooltipOpenState} arrow>
            <FormControlLabel
              control={
                <Switch
                  checked={!disabledState}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    addLog(`Clicked enable/disable button for ${filterLabel} slider`);
                    setDisabledState(!event.target.checked);
                    // if (event.target.checked) {
                    //   // If we enable slider, then update slider: 
                    //   dispatchFilter({
                    //     type: 'update slider',
                    //     filterLabel,
                    //     min: value[0],
                    //     max: value[1],
                    //   });
                    // } else {
                    //   dispatchFilter({
                    //     type: 'disable slider',
                    //     filterLabel,
                    //   });
                    // }
                  }}
                  color='success'
                />
              }
              labelPlacement='start'
              label={
                <Typography
                  id={`input-label-${filterLabel}`}
                  variant='caption'
                  gutterBottom
                  sx={{
                    textTransform: 'capitalize',
                  }}
                  color='success'
                >
                  {`${disabledState ? 'Disabled' : 'Enabled'}`}
                </Typography>
              }
            />
          </Tooltip>
        </FormGroup>
      </Box>
      <Slider
        getAriaLabel={() => filterLabel}
        value={value}
        onChange={(event: Event, newValue: number | number[], activeThumb: number) => {
          if (!Array.isArray(newValue)) {
            return;
          }
          const minimumThumbSeparation = 3;
          if (activeThumb === 0) {
            setValue([Math.min(newValue[0], value[1] - minimumThumbSeparation), value[1]]);
          } else {
            setValue([value[0], Math.max(newValue[1], value[0] + minimumThumbSeparation)]);
          }
          //   setValue(newValue as number[]);
        }}
        valueLabelDisplay='auto'
        // getAriaValueText={valuetext}
        disableSwap
        min={initialValues[filterLabel][0]}
        max={initialValues[filterLabel][1]}
        disabled={disabledState}
        marks={[
          {
            value: userDetails.measurements[filterLabel],
            label: `${userDetails.measurements[filterLabel]}cm`,
          },
        ]}
      />
    </Box>
  );
}

export default SizeSlider;
