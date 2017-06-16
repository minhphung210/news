import React, { Component } from 'react';

export default class Child extends Component {
    constructor(props) {
        super();
        this.common = {
            _state: props === undefined ? undefined : props._state
        }
        this._state = props === undefined ? undefined : props._state ;
    }

    static contextTypes = {
        appState: React.PropTypes.func,
        changeLanguage: React.PropTypes.func,
        foo: React.PropTypes.object,
        bar: React.PropTypes.func
    }

    componentWillMount() {
      this.store = this.context.appState;
      this.data = this.context.foo;
      this.setData = this.context.bar;
    }

}
