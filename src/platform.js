import {WebExtensionPlatform, Platforms, PlatformTypes} from 'neon-extension-browser-webextension/platform';


export {
    Platforms,
    PlatformTypes
};

export class ChromePlatform extends WebExtensionPlatform {
    get name() {
        return Platforms.Chrome;
    }
}

export default new ChromePlatform();
