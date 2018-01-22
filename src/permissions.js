import {WebExtensionsPermissions} from 'neon-extension-browser-webextension/permissions';


export class ChromePermissions extends WebExtensionsPermissions {
    static get api() {
        return chrome.permissions;
    }
}

export default new ChromePermissions();
