import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import useInterval from '../../CustomHooks/UseInterval';
import { fetchGeolocationApi, fetchIpApiObject, getDeviceData } from '../../utils/analytics';
import { fetchPostLoggingServer } from '../../utils/fetchRequests';
import { getSecondsSince } from './loggingContextFunctions';

interface LoggingContextInterface {
  setSessionState: React.Dispatch<React.SetStateAction<SessionState>>;
  addLog: (action: string, location: string) => void;
}

export interface LoggingObject {
  sessionId: string | undefined;
  secondsPassed: number;
  localLogId: number;
  localTimestamp: string;
  action: string;
  location: string;
}

interface SessionState {
  sessionId: string | undefined;
  secondsPassed: number;
  secondsInterval: number;
  latestLocalLogId: number;
  logOfUserActions: LoggingObject[];
  timeOfLanding: string;
}

export const LoggingContext = React.createContext<LoggingContextInterface>(
  {} as LoggingContextInterface
);

export default function LoggingContextProvider(props: { children: React.ReactNode }) {
  const { enqueueSnackbar } = useSnackbar();
  const [sessionState, setSessionState] = useState<SessionState>({
    sessionId: undefined,
    secondsPassed: 0,
    secondsInterval: 0,
    latestLocalLogId: 0,
    logOfUserActions: [],
    timeOfLanding: new Date().toISOString(),
  });
  const [intervalStateObject, setIntervalStateObject] = useState({
    intervalSeconds: 15,
    updateString: 'initialised',
    timeElapsed: 0,
  });

  function addLog(action: string, pathname: string) {
    setSessionState((prev) => ({
      ...prev,
      latestLocalLogId: prev.latestLocalLogId + 1,
      logOfUserActions: prev.logOfUserActions.concat({
        sessionId: prev.sessionId,
        secondsPassed: getSecondsSince(sessionState.timeOfLanding),
        localLogId: prev.latestLocalLogId + 1,
        localTimestamp: new Date().toISOString(),
        action,
        location: pathname,
      }),
    }));
  }

  async function initialAnalyticsCall() {
    const sessionObject = JSON.parse(localStorage.getItem('sessionObject') || '{}');
    // If we already have a sessionId, no need to fire initial.
    if (
      typeof sessionObject.sessionId === 'string' &&
      sessionObject.sessionId.length > 0 &&
      typeof sessionObject.sessionId === 'string'
    ) {
      setSessionState((prev) => ({
        ...prev,
        sessionId: sessionObject.sessionId,
        timeOfLanding: sessionObject.timeOfLanding,
      }));
      return;
    }
    // If no localstorage sessionId, then create a session
    const deviceDataObject = getDeviceData();
    const ipObject = await fetchIpApiObject();
    const geolocationObject = await fetchGeolocationApi();

    const postToBackEndForSessionId = await fetchPostLoggingServer(
      '/logging/initial',
      JSON.stringify({ ipObject, geolocationObject, deviceDataObject })
    );
    const parsedResponse = await postToBackEndForSessionId.json();
    if (typeof parsedResponse.body.id !== 'string' && parsedResponse.body.id.length < 1) {
      enqueueSnackbar('Error getting sessionId from Initial Analytics call', { variant: 'error' });
      return;
    }

    setSessionState((prev) => ({
      ...prev,
      sessionId: parsedResponse.body.id,
      timeOfLanding: new Date().toISOString(),
    }));
    localStorage.setItem(
      'sessionObject',
      JSON.stringify({
        ...sessionObject,
        sessionId: parsedResponse.body.id,
        timeOfLanding: new Date().toISOString(),
      })
    );
  }

  // On initial load: Send initial request to server
  useEffect(() => {
    // TODO: Need to turn this on when going live
    if (process.env.NODE_ENV === 'development') return;
    initialAnalyticsCall();
  }, []);

  // Send actionLogs every 15 seconds
  useInterval(async () => {
    // if (process.env.NODE_ENV === 'development') return;
    setIntervalStateObject((prev) => ({
      ...prev,
      timeElapsed: prev.timeElapsed + prev.intervalSeconds,
    }));
    setSessionState((prev) => ({
      ...prev,
      secondsInterval: prev.secondsInterval + intervalStateObject.intervalSeconds,
    }));
    // Send SessionData to Back End
    let arrayToSend = sessionState.logOfUserActions;
    let latestLocalLogIdTracker = sessionState.latestLocalLogId;
    // Handle if length is 0.
    if (arrayToSend.length === 0) {
      arrayToSend = [
        {
          localLogId: sessionState.latestLocalLogId + 1,
          localTimestamp: new Date().toISOString(),
          action: 'interval elapsed with no actions recorded',
          sessionId: sessionState.sessionId,
          secondsPassed: getSecondsSince(sessionState.timeOfLanding),
          location: 'unknown',
        },
      ];
      latestLocalLogIdTracker += 1;
      setIntervalStateObject((prev) => ({
        ...prev,
        intervalSeconds: prev.intervalSeconds * 2,
        updateString: 'doubled delay as no actions recorded',
      }));
    } else if (arrayToSend.length > 0) {
      setIntervalStateObject((prev) => ({
        ...prev,
        intervalSeconds: 15,
        updateString: 'actions were recorded. Set delay to 15.',
      }));
    }

    // Update SessionState
    await fetchPostLoggingServer(
      '/logging/interval',
      JSON.stringify({ logOfUserActions: arrayToSend })
    );

    setSessionState((prev) => ({
      ...prev,
      logOfUserActions: prev.logOfUserActions.filter(
        (thisObj) => thisObj.localLogId > latestLocalLogIdTracker
      ),
      latestLocalLogId: latestLocalLogIdTracker,
    }));
  }, intervalStateObject.intervalSeconds * 1000);

  // On initial load: Send initial request to server
  useEffect(() => {
    // if (process.env.NODE_ENV === 'development') return;
    initialAnalyticsCall();
  }, []);

  const value = React.useMemo(
    () => ({
      setSessionState,
      addLog,
    }),
    []
  );

  return <LoggingContext.Provider value={value} {...props} />;
}
