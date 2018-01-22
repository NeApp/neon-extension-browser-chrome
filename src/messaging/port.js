import {WebExtensionsPort} from 'neon-extension-browser-webextension/messaging/port';


export class ChromePort extends WebExtensionsPort {
    static get api() {
        return chrome.runtime;
    }
}
