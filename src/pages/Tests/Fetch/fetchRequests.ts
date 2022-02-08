import { logAdminExternal } from '../../../utils/logging';

const domainUrl = '';

function getRequestHeaders() {
    const requestHeaders = new Headers();
    // requestHeaders.set('xsrf-token', localStorage.getItem('xsrf-token') as string);
    requestHeaders.set('Accept', 'application/json');
    requestHeaders.set('Content-Type', 'application/json');
    // requestHeaders.set('jwt_token', localStorage.getItem('session-token') as string);
    return requestHeaders;
}
export function fetchGetBase(url: string) {
    // eslint-disable-next-line no-unused-expressions
    logAdminExternal('fetch GET to:', `${domainUrl}${url}`);
    return fetch(`${domainUrl}${url}`, {
        method: 'GET',
        // headers: getRequestHeaders(),
        // credentials: 'include',
        // mode: 'cors',
    }); // fetch
}

export function fetchPostBase(url: string, bodyPayload: string) {
    logAdminExternal('fetch POST to:', `${domainUrl}${url}`, 'with', bodyPayload);
    return fetch(`${domainUrl}${url}`, {
        method: 'POST',
        headers: getRequestHeaders(),
        credentials: 'include',
        mode: 'cors',
        body: bodyPayload,
    }); // fetch
}
