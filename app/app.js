import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import {TeaNews} from './index';
import ReduxThunk from 'redux-thunk';

class App extends Component {
  render () {
    return (
      <Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
          <TeaNews />
      </Provider>
    )
  }
}

export default App;
