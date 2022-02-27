import * as ReactDeviceDetect from 'react-device-detect';
import { logAdminExternal } from './logging';


export type ErrorRequestObject = { error: { description: string } };

export interface fetchIpApiObject {
    ip: string
};

export async function fetchIpApiObject(): Promise<fetchIpApiObject | ErrorRequestObject> {
    return fetch('https://api.ipify.org?format=json')
        .then((response) => response.json())
        .catch((err: Error) => {
            logAdminExternal('Problem fetching my IP', err);
            return { error: { description: `error in function IpApiObject(). Message: ${err.message}` } }
        });
}

export interface GeolocationResponse {
    "country_code": string,
    "country_name": string,
    city: string,
    postal: string,
    latitude: number,
    longitude: number,
    IPv4: string,
    state: string
}

export async function fetchGeolocationApi(): Promise<GeolocationResponse | ErrorRequestObject> {
    return fetch('https://geolocation-db.com/json/')
        .then((response) => response.json())
        .catch((err: Error) => {
            logAdminExternal('Problem fetching my IP', err);
            return { error: { description: `error in function IpApiObject(). Message: ${err.message}` } }
        });
}

export interface DeviceData {
    'browserName': string,
    'deviceType': string,
    'getUA': string,
    'mobileModel': string,
    'mobileVendor': string,
    'osName': string,
}

export function getDeviceData(): DeviceData {
    // Use ReactDeviceDetect library to get device data.
    return Object.keys(ReactDeviceDetect).reduce<DeviceData>((prev, cur) => {
        // Filter only useful keys
        const usefulKeys = [
            'browserName',
            'deviceType',
            'getUA',
            'mobileModel',
            'mobileVendor',
            'osName',
        ];
        const thisValue = (ReactDeviceDetect as unknown as Record<string, string>)[cur];
        if (usefulKeys.includes(cur) && typeof thisValue === "string") {
            const returnObj = { ...prev };
            returnObj[cur as keyof DeviceData] = thisValue;
            return returnObj;
        }
        return prev;
    }, {} as DeviceData);
}