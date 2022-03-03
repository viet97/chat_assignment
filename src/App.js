
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import AppNavigator from './navigation/AppNavigation';
import rootReducer from './reducers';
import Loading from './Loading';
GoogleSignin.configure({
  webClientId: '297921877463-g316ir2cc0kv3ps3vdhbnsamtluomsbd.apps.googleusercontent.com',
});
const store = createStore(rootReducer)

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <SafeAreaView style={{
          flex: 1,
          backgroundColor: "white"
        }}>
          <AppNavigator />
        </SafeAreaView>
        <Loading />
      </Provider>
    );
  }
}
