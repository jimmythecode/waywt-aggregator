import { logAdminExternal } from './logging';

let domainUrl = process.env.REACT_APP_BACKEND_URL_LOCAL;
if (process.env.NODE_ENV === 'production') {
  domainUrl = process.env.REACT_APP_BACKEND_URL_HOSTED;
}

let loggingServerUrl = process.env.REACT_APP_BACKEND_URL_LOCAL;
if (process.env.NODE_ENV === 'production') {
  loggingServerUrl = process.env.REACT_APP_LOGGING_URL;
}

function getRequestHeaders() {
  const requestHeaders = new Headers();
  requestHeaders.set('Accept', 'application/json');
  requestHeaders.set('Content-Type', 'application/json');
  return requestHeaders;
}
export function fetchGetBackEnd(url: string) {
  console.log('firing fetch to: ', `${domainUrl}${url}`);
  console.log({ domainUrl, url });
  console.log(process.env);
  

  return fetch(`${domainUrl}${url}`, {
    method: 'GET',
    headers: getRequestHeaders(),
    mode: 'cors',
  }); // fetch
}

export function fetchPostBackEnd(url: string, bodyPayload: string) {
  logAdminExternal({ domainUrl, url });

  return fetch(`${domainUrl}${url}`, {
    method: 'POST',
    headers: getRequestHeaders(),
    mode: 'cors',
    body: bodyPayload,
  }); // fetch
}

export function fetchPostLoggingServer(url: string, bodyPayload: string) {
  const loggingUrl = `${loggingServerUrl}${url}`;
  logAdminExternal({ loggingServerUrl, url });

  return fetch(loggingUrl, {
    method: 'POST',
    headers: getRequestHeaders(),
    credentials: 'include',
    mode: 'cors',
    body: bodyPayload,
  }); // fetch
}
