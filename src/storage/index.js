import IsNil from 'lodash-es/isNil';

import {Storage} from 'neon-extension-browser-base/storage';
import {WebExtensionsStorage} from 'neon-extension-browser-webextension/storage';

import {ChromeStorageContext} from './context';


export class ChromeStorage extends WebExtensionsStorage {
    static get api() {
        if(IsNil(chrome.storage)) {
            return null;
        }

        return chrome.storage.local;
    }

    context(name) {
        return new ChromeStorageContext(this, name);
    }

    remove(key) {
        if(!this.constructor.supportsStorageApi) {
            return Storage.prototype.remove.call(this, key);
        }

        return new Promise((resolve, reject) => {
            // Remove value from storage
            this.api.remove(key, () => {
                let err = chrome.runtime.lastError;

                if(!IsNil(err)) {
                    // Reject promise with error
                    reject(err);
                    return;
                }

                // Resolve promise
                resolve();
            });
        });
    }

    get(key) {
        if(!this.constructor.supportsStorageApi) {
            return Storage.prototype.get.call(this, key);
        }

        return new Promise((resolve, reject) => {
            // Try retrieve value from storage
            this.api.get(key, (items) => {
                let err = chrome.runtime.lastError;

                if(!IsNil(err)) {
                    // Reject promise with error
                    reject(err);
                    return;
                }

                // Resolve promise with value (if defined)
                let value = items[key];

                if(!IsNil(value)) {
                    resolve(value);
                    return;
                }

                // Fallback to `localStorage`
                resolve(Storage.prototype.get.call(this, key));
            });
        });
    }

    put(key, value) {
        if(!this.constructor.supportsStorageApi) {
            return Storage.prototype.put.call(this, key, value);
        }

        // Build item
        let item = {};

        item[key] = value;

        return new Promise((resolve, reject) => {
            // Put value in storage
            this.api.set(item, () => {
                let err = chrome.runtime.lastError;

                if(!IsNil(err)) {
                    // Reject promise with error
                    reject(err);
                    return;
                }

                // Resolve promise
                resolve();
            });
        });
    }
}

export default new ChromeStorage();
