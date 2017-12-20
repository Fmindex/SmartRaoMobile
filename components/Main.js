import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

import Axios from 'axios';
import React from 'react';
import firebase from 'firebase';

export default class App extends React.Component {
  static navigationOptions = {
    title: 'Main'
  };
  constructor() {
    super();
    console.ignoredYellowBox = ['Setting a timer'];
    this.state = {
      text: 'Hello',
      username: 'naisk133@gmail.com',
      password: '123456',
      on: false,
      manual: false,
      snapshot: {},
      toggleButtonActive: true,
      manualButtonActive: true
    };
    this.baseUrl = 'http://192.168.43.181:3000/';
    this.fireToggleRequest = this.fireToggleRequest.bind(this);
    this.manualToggleRequest = this.manualToggleRequest.bind(this);
  }
  componentWillMount() {
    console.log('will mount');
    this.databaseRef = firebase.database().ref('/');
    this.databaseRef.on('value', snapshot => {
      console.log(snapshot);
      const { humid, on, temp, manual } = snapshot.val();
      console.log(humid, on, temp, manual);
      this.setState({
        humid,
        on,
        temp,
        manual,
        toggleButtonActive: true
      });
      clearTimeout(this.timer);
    });
  }

  componentWillUnmount() {
    this.databaseRef.off();
  }

  fireToggleRequest() {
    const { on } = this.state;
    this.setState({
      toggleButtonActive: false
    });
    Axios.get(this.baseUrl + (!on ? 'on' : 'off'), {
      headers: { Token: this.props.navigation.state.params.token }
    })
      .then(() => {
        this.timer = setTimeout(() => {
          if (!this.state.toggleButtonActive) {
            this.setState({
              toggleButtonActive: true
            });
            alert('NodeMCU is not responding, Please try again');
          }
        }, 5000);
      })
      .catch(error => {
        this.setState({
          toggleButtonActive: true
        });
        alert(error);
      });
  }

  manualToggleRequest() {
    const { manual } = this.state;
    this.setState({
      manualButtonActive: false
    });
    Axios.get(this.baseUrl + 'manual/' + !manual, {
      headers: { Token: this.props.navigation.state.params.token }
    })
      .then(msg =>
        this.setState({
          manualButtonActive: true
        })
      )
      .catch(err => {
        this.setState({
          manualButtonActive: true
        });
        alert(err);
      });
  }

  logout() {
    firebase
      .auth()
      .signOut()
      .then(() => alert('Logged out'))
      .catch(error => alert('Logout error: ' + error));
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          title={this.state.manual ? 'Manual' : 'Auto'}
          onPress={this.manualToggleRequest}
          disabled={!this.state.manualButtonActive}
        />
        <Button
          title={this.state.on ? 'On' : 'Off'}
          onPress={this.fireToggleRequest}
          disabled={!this.state.toggleButtonActive}
          color={this.state.on ? 'green' : 'red'}
        />
        <Text>Current temp: {this.state.temp}</Text>
        <Text>Current humid: {this.state.humid}</Text>
        <Button title="Logout" onPress={this.logout} />
        <Text>{JSON.stringify(this.state)}</Text>
      </View>
    );
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
