/* eslint-disable no-console */
import { Box, Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { fetchGetBase, fetchPostBase } from './fetchRequests';
import { logAdminExternal } from '../../utils/logging';

const url = 'https://api.publicapis.org/entries';
function RequestTests() {
  const { enqueueSnackbar } = useSnackbar();
  const [getStringState, setGetStringState] = useState(url);
  const [postStringState, setPostStringState] = useState(url);
  const [getResponseState, setGetResponseState] = useState({ status: 'Request Not Yet Triggered' });
  const [postResponseState, setPostResponseState] = useState({
    status: 'Request Not Yet Triggered',
  });

  // const url = "https://todoapi20220120072839.azurewebsites.net/api/todoitems";

  async function fetchPostButtonClicked() {
    enqueueSnackbar('fetch sending!', { variant: 'info' });
    fetchPostBase(getStringState, JSON.stringify({ foo: 'bar' }))
      .then((response) => {
        enqueueSnackbar('We got a response!', { variant: 'info' });
        return response.json();
      })
      .then((parsedResponse) => {
        logAdminExternal(parsedResponse);
        enqueueSnackbar('We parsed!', { variant: 'success' });
        setPostResponseState(parsedResponse);
      })
      .catch((error) => {
        console.error(error);
        enqueueSnackbar('error sending request. See console', { variant: 'error' });
      });
  }

  async function fetchGetButtonClicked() {
    enqueueSnackbar('fetch sending!', { variant: 'info' });
    fetchGetBase(getStringState)
      .then((response) => {
        enqueueSnackbar('fetch response!', { variant: 'info' });
        return response.json();
      })
      .then((parsedResponse) => {
        enqueueSnackbar('fetch paring!', { variant: 'success' });
        logAdminExternal(parsedResponse);
        setGetResponseState(parsedResponse as unknown as {status: string});
      })
      .catch((error) => {
        console.error(error);
        enqueueSnackbar('error sending request. See console', { variant: 'error' });
      });
  }

  return (
    <div>
      <button type='button' 
      onClick={() => setGetStringState("https://api.publicapis.org/entries")}
      >
      https://api.publicapis.org/entries
      </button>
      <button type='button' 
      onClick={() => setGetStringState("https://todoapi20220120072839.azurewebsites.net/api/todoitems")}
      >
      https://todoapi20220120072839.azurewebsites.net/api/todoitems
      </button>
      <Box
        sx={{
          border: 'solid 1px silver',
          borderRadius: '10px',
          padding: 3,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            // width: 200,
            height: 100,
          }}
        >
          <TextField
            // sx={{ width: 180 }}
            id='get-input'
            label='Paste URL for GET request'
            value={getStringState}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setGetStringState(event.target.value)
            }
          />
          <Button
            sx={{ minWidth: 200 }}
            onClick={() => fetchGetButtonClicked()}
            variant='contained'
          >
            Send Get Request
          </Button>
        </Box>
        <Box
          sx={{
            border: 'solid 1px silver',
            borderRadius: '10px',
            // padding: 1,
            marginLeft: 1,
            overflow: 'auto',
            height: 120,
            boxSizing: 'border-box',
            flex: 'auto',
          }}
        >
          <p style={{ margin: 8, width: '100%' }}>{JSON.stringify(getResponseState)}</p>
        </Box>
      </Box>

      <Box
        sx={{
          border: 'solid 1px silver',
          borderRadius: '10px',
          padding: 3,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            // width: 200,
            height: 100,
          }}
        >
          <TextField
            id='post-input'
            label='Paste URL for POST request'
            value={postStringState}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setPostStringState(event.target.value)
            }
            sx={{
              height: 100,
            }}
          />
          <Button
            sx={{ minWidth: 200 }}
            onClick={() => fetchPostButtonClicked()}
            variant='contained'
            color='secondary'
          >
            Send POST Request
          </Button>
        </Box>
        <Box
          sx={{
            border: 'solid 1px silver',
            borderRadius: '10px',
            // padding: 1,
            marginLeft: 1,
            overflow: 'auto',
            height: 120,
            boxSizing: 'border-box',
            flex: 'auto',
          }}
        >
          <p style={{ margin: 8, width: '100%' }}>{JSON.stringify(postResponseState)}</p>
        </Box>
      </Box>
    </div>
  );
}

export default RequestTests;
