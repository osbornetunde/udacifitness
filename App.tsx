import React from 'react';
import { View } from 'react-native';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import AddEntry from './components/AddEntry.js';
import reducer from './reducers';
import History from './components/History.js';

const store = createStore(reducer);

export default function App() {
  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        <View style={{height: 20}}/>
        <History/>
        {/*<AddEntry/>*/}
      </View>
      </Provider>
  );
}


