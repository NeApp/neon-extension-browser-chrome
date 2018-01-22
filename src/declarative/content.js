import IsNil from 'lodash-es/isNil';

import Deferred from 'neon-extension-framework/core/deferred';
import {NotImplementedError} from 'neon-extension-framework/core/exceptions';
import {WebExtensionsDeclarativeContent} from 'neon-extension-browser-webextension/declarative/content';

import {RequestContentScript, SetIcon, ShowPageAction} from './actions';
import {PageStateMatcher} from './conditions';


export class ChromeDeclarativeContent extends WebExtensionsDeclarativeContent {
    static get api() {
        return chrome.declarativeContent;
    }

    addRules(rules) {
        let deferred = Deferred();

        // Construct rules
        rules = rules.map((rule) => {
            return {
                ...rule,

                actions: rule.actions.map((action) =>
                    this._createAction(action)
                ),
                conditions: rule.conditions.map((condition) =>
                    this._createCondition(condition)
                )
            };
        });

        // Add rules
        this.api.onPageChanged.addRules(rules, (registeredRules) => {
            deferred.resolve(registeredRules);
        });

        return deferred.promise();
    }

    removeRules(ruleIdentifiers) {
        let deferred = Deferred();

        // Remove rules
        this.api.onPageChanged.removeRules(ruleIdentifiers, () => {
            deferred.resolve();
        });

        return deferred.promise();
    }

    getRules(ruleIdentifiers) {
        let deferred = Deferred();

        // Get rules
        this.api.onPageChanged.getRules(ruleIdentifiers, (rules) => {
            deferred.resolve([
                ...rules.map((rule) => {
                    return {
                        ...rule,

                        actions: rule.actions.map((action) =>
                            this._parseAction(action)
                        ),
                        conditions: rule.conditions.map((condition) =>
                            this._parseCondition(condition)
                        )
                    };
                })
            ]);
        });

        return deferred.promise();
    }

    // region Private methods

    _createAction(action) {
        if(IsNil(action)) {
            return null;
        }

        if(action instanceof RequestContentScript) {
            return new this.api.RequestContentScript({
                css: action.css,
                js: action.js,

                allFrames: action.allFrames,
                matchAboutBlank: action.matchAboutBlank
            });
        }

        if(action instanceof SetIcon) {
            return new this.api.SetIcon({
                imageData: action.imageData
            });
        }

        if(action instanceof ShowPageAction) {
            return new this.api.ShowPageAction();
        }

        throw new NotImplementedError('Unsupported action: ' + action);
    }

    _createCondition(condition) {
        if(IsNil(condition)) {
            return null;
        }

        if(condition instanceof PageStateMatcher) {
            let options = {
                pageUrl: condition.pageUrl
            };

            if(!IsNil(condition.css) && condition.css.length > 0) {
                options.css = condition.css;
            }

            if(condition.isBookmarked) {
                options.isBookmarked = condition.isBookmarked;
            }

            return new this.api.PageStateMatcher(options);
        }

        throw new NotImplementedError('Unsupported condition: ' + condition);
    }

    _parseAction(action) {
        if(IsNil(action)) {
            return null;
        }

        // Retrieve action type
        let type = !IsNil(action.instanceType) ? action.instanceType : null;

        if(type) {
            type = type.substring(type.lastIndexOf('.') + 1);
        }

        // Parse action
        if(action instanceof this.api.RequestContentScript || type === 'RequestContentScript') {
            return new RequestContentScript({
                css: action.css,
                js: action.js,

                allFrames: action.allFrames,
                matchAboutBlank: action.matchAboutBlank
            });
        }

        if(action instanceof this.api.SetIcon || type === 'SetIcon') {
            return new SetIcon({
                imageData: action.imageData
            });
        }

        if(action instanceof this.api.ShowPageAction || type === 'ShowPageAction') {
            return new ShowPageAction();
        }

        throw new NotImplementedError('Unsupported action');
    }

    _parseCondition(condition) {
        if(IsNil(condition)) {
            return null;
        }

        // Retrieve condition type
        let type = !IsNil(condition.instanceType) ? condition.instanceType : null;

        if(type) {
            type = type.substring(type.lastIndexOf('.') + 1);
        }

        // Parse condition
        if(condition instanceof this.api.PageStateMatcher || type === 'PageStateMatcher') {
            return new PageStateMatcher({
                pageUrl: condition.pageUrl,
                css: condition.css,

                isBookmarked: condition.isBookmarked
            });
        }

        throw new NotImplementedError('Unsupported condition');
    }

    // endregion
}

export default new ChromeDeclarativeContent();
