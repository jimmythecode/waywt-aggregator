/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
// import { UserAgent } from 'react-useragent';
import * as ReactDeviceDetect from 'react-device-detect';
import Pretty from '../../components/Pretty';

function Analytics() {
  const [ipAddressResponse, setIpAddressResponse] = useState({});
  const [geolocationResponseState, setGeolocationResponseState] = useState({});

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then((response) => response.json())
      .then((res: Response) => {
        setIpAddressResponse(res);
      })
      .catch((err: Error) => {
        console.error('Problem fetching my IP', err);
        setIpAddressResponse(err);
      });

    fetch('https://geolocation-db.com/json/')
      .then((response) => response.json())
      .then((res: Response) => {
        setGeolocationResponseState(res);
      })
      .catch((err: Error) => {
        console.error('Problem fetching my IP', err);
        setGeolocationResponseState(err);
      });
  }, []);

  const filteredUserAgentThisDevice = Object.keys(ReactDeviceDetect).reduce((prev, cur) => {
    const usefulKeys = [
      'browserName',
      'browserVersion',
      'deviceType',
      'engineName',
      'engineVersion',
      'fullBrowserVersion',
      'getUA',
      'mobileModel',
      'mobileVendor',
      'osName',
      'osVersion',
    ];
    const thisValue = (ReactDeviceDetect as Record<string, unknown>)[cur];
    if (thisValue === true || usefulKeys.includes(cur) && typeof thisValue === "string") {
      const returnObj = { ...prev };
    //   logAdminExternal({
    //     thisValue,
    //     cur,
    //     returnObj,
    //     prev,
    //   });
      returnObj[cur] = thisValue;
      return returnObj;
    }
    return prev;
  }, {} as Record<string, boolean | string>);

  return (
    <div>
      <Pretty yourData={ipAddressResponse} />
      <Pretty yourData={geolocationResponseState} />
      {/* <Pretty yourData={ReactDeviceDetect} /> */}
      <Pretty yourData={filteredUserAgentThisDevice} />
    </div>
  );
}

export default Analytics;
