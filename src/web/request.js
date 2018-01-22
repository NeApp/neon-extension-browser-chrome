import {WebExtensionsWebRequest} from 'neon-extension-browser-webextension/web/request';

import {ChromeWebRequestEvent} from './requestEvent';


export class ChromeWebRequest extends WebExtensionsWebRequest {
    static get api() {
        return chrome.webRequest;
    }

    createEvent(name) {
        return new ChromeWebRequestEvent(name);
    }
}

export default new ChromeWebRequest();
