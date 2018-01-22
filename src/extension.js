import {WebExtensionsExtension} from 'neon-extension-browser-webextension/extension';


export class ChromeExtension extends WebExtensionsExtension {
    static get api() {
        return chrome.runtime;
    }

    get origin() {
        return 'chrome-extension://' + this.id;
    }
}

export default new ChromeExtension();
