import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import useInterval from '../CustomHooks/UseInterval';
import { fetchPostBase } from '../pages/TestsPage/Fetch/fetchRequests';
import { fetchGeolocationApi, fetchIpApiObject, getDeviceData } from '../utils/analytics';
import { logAdminExternal } from '../utils/logging';

interface LoggingContextInterface {
  //   logOfUserActions: LoggingObject[];
  setLogOfUserActions: React.Dispatch<React.SetStateAction<LoggingObject[]>>;
  updateLog: (action: string) => void;
}

export interface LoggingObject {
  localLogId: number;
  localTimestamp: string;
  action: string;
}

interface SessionState {
  sessionId: number;
  secondsPassed: number;
}

export const LoggingContext = React.createContext<LoggingContextInterface>(
  {} as LoggingContextInterface
);

export default function LoggingContextProvider(props: { children: React.ReactNode }) {
  const { enqueueSnackbar } = useSnackbar();
  const [logOfUserActions, setLogOfUserActions] = useState<LoggingObject[]>([]);
  const [sessionState, setSessionState] = useState<SessionState>({
    sessionId: 0,
    secondsPassed: 0,
  });

  function updateLog(action: string) {
    setLogOfUserActions((prev) =>
      prev.concat({
        localLogId: 1,
        localTimestamp: new Date().toISOString(),
        action,
      })
    );
  }

  async function initialAnalyticsCall() {
    const deviceDataObject = getDeviceData();
    const ipObject = await fetchIpApiObject();
    const geolocationObject = await fetchGeolocationApi();
    logAdminExternal({
      ipObject,
      geolocationObject,
      deviceDataObject,
    });
    const postToBackEndForSessionId = await fetchPostBase(
      '/analytics/initial',
      JSON.stringify({ ipObject, geolocationObject, deviceDataObject })
    );
    const parsedResponse = await postToBackEndForSessionId.json();
    if (typeof parsedResponse.Id !== 'string') {
      enqueueSnackbar('Error getting sessionId from Initial Analytics call', { variant: 'error' });
      return;
    }
    setSessionState((prev) => ({ ...prev, sessionId: parsedResponse.Id }));
  }

  useInterval(() => {
    logAdminExternal({
      status: 'sending interval analytics',
      sessionId: sessionState.sessionId,
      secondsPassed: sessionState.secondsPassed + 15,
      logOfUserActions,
    });
    // Update SessionState
    setSessionState((prev) => ({ ...prev, secondsPassed: prev.secondsPassed + 15 }));
    // Send SessionData to Back End
    const arrayToSend = logOfUserActions.map((thisObj) => ({
      ...thisObj,
      sessionId: sessionState.sessionId,
      secondsPassed: sessionState.secondsPassed + 15,
    }));
    fetchPostBase('/analytics/interval', JSON.stringify(arrayToSend));
  }, 3000);

  useEffect(() => {
    // TODO: Need to turn this on when going live
    initialAnalyticsCall();
  }, []);

  const value = React.useMemo(
    () => ({
      //   logOfUserActions,
      setLogOfUserActions,
      updateLog,
    }),
    []
  );

  return <LoggingContext.Provider value={value} {...props} />;
}
