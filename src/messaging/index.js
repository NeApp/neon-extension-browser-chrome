import {WebExtensionsMessaging} from 'neon-extension-browser-webextension/messaging';

import {ChromePort} from './port';


export class ChromeMessaging extends WebExtensionsMessaging {
    static get api() {
        return chrome.runtime;
    }

    createPortWrapper(port) {
        return new ChromePort(port);
    }
}

export default new ChromeMessaging();
