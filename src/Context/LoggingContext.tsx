import React, { useEffect, useState } from 'react';
import useInterval from '../CustomHooks/UseInterval';
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
    const deviceData = getDeviceData();
    const IpApiObject = await fetchIpApiObject();
    const geoLocationObject = await fetchGeolocationApi();
    // logAdminExternal({
    //   IpApiObject,
    //   geoLocationObject,
    //   deviceData,
    // });
    // const postToBackEndForSessionId = await fetchPostBase(
    //   '/analytics/initial',
    //   JSON.stringify({ IpApiObject, geoLocationObject, deviceData })
    // );
    // const parsedResponse = await postToBackEndForSessionId.json();
    // setSessionState((prev) => ({ ...prev, sessionId: parsedResponse.sessionId }));

    
  }

  useInterval(() => {
    // logAdminExternal({
    //   status: 'sending interval analytics',
    //   sessionId: sessionState.sessionId,
    //   secondsPassed: sessionState.secondsPassed + 15,
    //   logOfUserActions,
    // });
    // Update SessionState
    setSessionState((prev) => ({ ...prev, secondsPassed: prev.secondsPassed + 15 }));
    // Send SessionData to Back End
    // fetchPostBase(
    //   '/analytics/interval',
    //   JSON.stringify({
    //     sessionId: sessionState.sessionId,
    //     secondsPassed: sessionState.secondsPassed + 15,
    //     logOfUserActions,
    //   })
    // );
  }, 3000);

  useEffect(() => {
    // TODO: Need to turn this on when going live
    // initialAnalyticsCall();
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
