import {WebExtensionsWebRequestEvent} from 'neon-extension-browser-webextension/web/requestEvent';


export class ChromeWebRequestEvent extends WebExtensionsWebRequestEvent {
    static get api() {
        return chrome.webRequest;
    }
}
