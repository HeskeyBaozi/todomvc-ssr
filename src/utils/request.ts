import * as fetch from "isomorphic-fetch";

function parseJSON(response: Response) {
    return response.json();
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    // error.response = response;
    throw new Error(response.statusText);
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options): Promise<any> {
    return fetch(url, options)
        .then(checkStatus)
        .then(parseJSON)
        .catch((err) => {
            throw err;
        });
}