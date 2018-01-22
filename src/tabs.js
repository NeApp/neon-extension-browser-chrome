import {WebExtensionsTabs} from 'neon-extension-browser-webextension/tabs';


export class ChromeTabs extends WebExtensionsTabs {
    static get api() {
        return chrome.tabs;
    }
}

export default new ChromeTabs();

