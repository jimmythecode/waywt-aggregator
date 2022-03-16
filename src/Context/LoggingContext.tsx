import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import useInterval from '../CustomHooks/UseInterval';
import { fetchPostBase } from '../pages/TestsPage/Fetch/fetchRequests';
import { fetchGeolocationApi, fetchIpApiObject, getDeviceData } from '../utils/analytics';

interface LoggingContextInterface {
  //   logOfUserActions: LoggingObject[];
  setSessionState: React.Dispatch<React.SetStateAction<SessionState>>;
  addLog: (action: string) => void;
}

export interface LoggingObject {
  sessionId: string;
  secondsPassed: number;
  localLogId: number;
  localTimestamp: string;
  action: string;
}

interface SessionState {
  sessionId: string;
  secondsPassed: number;
  latestLocalLogId: number;
  logOfUserActions: LoggingObject[];
}

export const LoggingContext = React.createContext<LoggingContextInterface>(
  {} as LoggingContextInterface
);

export default function LoggingContextProvider(props: { children: React.ReactNode }) {
  const { enqueueSnackbar } = useSnackbar();
  const [sessionState, setSessionState] = useState<SessionState>({
    sessionId: '',
    secondsPassed: 0,
    latestLocalLogId: 0,
    logOfUserActions: [],
  });
  const [intervalStateObject, setIntervalStateObject] = useState({
    intervalSeconds: 15,
    updateString: "initialised",
    timeElapsed: 0,
  })

  function addLog(action: string) {
    setSessionState((prev) => ({
      ...prev,
      latestLocalLogId: prev.latestLocalLogId + 1,
      logOfUserActions: prev.logOfUserActions.concat({
        sessionId: prev.sessionId,
        secondsPassed: prev.secondsPassed,
        localLogId: prev.latestLocalLogId + 1,
        localTimestamp: new Date().toISOString(),
        action,
      }),
    }));
  }

  async function initialAnalyticsCall() {
    const sessionObject = JSON.parse(localStorage.getItem('sessionObject') || '{}');
    // If we already have a sessionId, no need to fire initial.
    if (typeof sessionObject.sessionId === 'string' && sessionObject.sessionId.length > 0) {
      setSessionState((prev) => ({ ...prev, sessionId: sessionObject.sessionId }));
      return;
    }
    // If no localstorage sessionId, then create a session
    const deviceDataObject = getDeviceData();
    const ipObject = await fetchIpApiObject();
    const geolocationObject = await fetchGeolocationApi();
    const postToBackEndForSessionId = await fetchPostBase(
      '/analytics/initial',
      JSON.stringify({ ipObject, geolocationObject, deviceDataObject })
    );
    const parsedResponse = (await postToBackEndForSessionId.json()) as { id: string };
    if (typeof parsedResponse.id !== 'string') {
      enqueueSnackbar('Error getting sessionId from Initial Analytics call', { variant: 'error' });
      return;
    }
    setSessionState((prev) => ({ ...prev, sessionId: parsedResponse.id }));
    localStorage.setItem('sessionObject', { ...sessionObject, sessionId: parsedResponse.id });
  }

  // Send actionLogs every 15 seconds
  useInterval(async () => {
    if (process.env.NODE_ENV === 'development') return;

    setIntervalStateObject(prev=>({...prev, timeElapsed: prev.timeElapsed + prev.intervalSeconds}))
    setSessionState((prev) => ({
      ...prev,
      secondsPassed: prev.secondsPassed + intervalStateObject.intervalSeconds,
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
          secondsPassed: sessionState.secondsPassed + intervalStateObject.intervalSeconds,
        },
      ];
      latestLocalLogIdTracker += 1;
      setIntervalStateObject(prev=>({...prev, intervalSeconds: prev.intervalSeconds * 2, updateString: "doubled delay as no actions recorded"}))
    } else if (arrayToSend.length > 0){
      setIntervalStateObject(prev=>({...prev, intervalSeconds: 15, updateString: "actions were recorded. Set delay to 15."}))
    }

    // Update SessionState
    await fetchPostBase('/analytics/interval', JSON.stringify({ logOfUserActions: arrayToSend }));

    setSessionState((prev) => ({
      ...prev,
      logOfUserActions: prev.logOfUserActions.filter(
        (thisObj) => thisObj.localLogId > latestLocalLogIdTracker
      ),
      latestLocalLogId: latestLocalLogIdTracker,
    }));
  }, intervalStateObject.intervalSeconds*1000);

  useEffect(() => {
    // TODO: Need to turn this on when going live
    if (process.env.NODE_ENV === 'development') return;
    initialAnalyticsCall();
  }, []);

  const value = React.useMemo(
    () => ({
      //   logOfUserActions,
      setSessionState,
      addLog,
    }),
    []
  );

  return <LoggingContext.Provider value={value} {...props} />;
}
