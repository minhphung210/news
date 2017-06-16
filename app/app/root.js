import React, { Component } from 'react';

export default class Root extends Component {

    constructor() {
        super();
        this.common = {
            _state: this.appState
        };
    }

    static childContextTypes = {
        appState: React.PropTypes.func,
        changeLanguage: React.PropTypes.func,
        foo: React.PropTypes.object,
        bar: React.PropTypes.func,
    };

    getChildContext = () => {
        return {
            appState: this.appState,
            foo: this.state,
            bar: this.setState,
            changeLanguage: this.changeLanguage
        }
    }

    appState = (obj, func) => {
        if (typeof obj === 'string') return this.state[obj];
        if (typeof obj === 'object' && typeof func === 'undefined') {
            this.setState(obj);
        } else if (typeof obj === 'object' && typeof func === 'function') {
            this.setState(obj, () => {
                func();
            })
        } else {
            return false;
        }

    }
}
