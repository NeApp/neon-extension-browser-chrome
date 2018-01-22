import {WebExtensionsWebRequest} from 'neon-extension-browser-webextension/web/request';

import {ChromeWebRequestEvent} from './requestEvent';


export class ChromeWebRequest extends WebExtensionsWebRequest {
    createEvent(name) {
        return new ChromeWebRequestEvent(name);
    }
}

export default new ChromeWebRequest();
