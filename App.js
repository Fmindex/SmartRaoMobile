import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  StatusBar,
  Platform
} from 'react-native';
import firebase from 'firebase';
import Axios from 'axios';
import config from './config';
import Login from './components/Login';
import Main from './components/Main';
import { NavigationActions, StackNavigator } from 'react-navigation';
const AppNavigator = StackNavigator(
  {
    Login: {
      screen: Login
    },
    Main: {
      screen: Main
    }
  },
  {
    cardStyle: {
      paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
    }
  }
);

export default class App extends React.Component {
  constructor(props) {
    super();
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        alert('Logging in');
        user.getIdToken().then(token => {
          this.navigator.dispatch(
            NavigationActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: 'Main',
                  params: { token }
                })
              ]
            })
          );
        });
      } else {
        this.navigator.dispatch(
          NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: 'Login'
              })
            ]
          })
        );
      }
    });
  }

  render() {
    return <AppNavigator ref={nav => (this.navigator = nav)} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
