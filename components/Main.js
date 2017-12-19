import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import firebase from 'firebase';
import Axios from 'axios';

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
      auth: null,
      on: false,
      snapshot: {},
      toggleButtonActive: true
    };
    this.baseUrl = 'http://192.168.43.181:3000/';
    this.fireToggleRequest = this.fireToggleRequest.bind(this);
  }
  componentWillMount() {
    console.log('will mount');
    this.databaseRef = firebase.database().ref('/');
    this.databaseRef.on('value', snapshot => {
      console.log(snapshot);
      const { humid, on, temp } = snapshot.val();
      console.log(humid, on, temp);
      this.setState({
        humid,
        on,
        temp,
        toggleButtonActive: true
      });
    });
  }

  componentWillUnmount() {
    this.databaseRef.off();
  }

  fireToggleRequest() {
    const { on } = this.state;
    console.log(this.props.navigation.state.params);
    this.setState({
      toggleButtonActive: false
    });
    Axios.get(this.baseUrl + (!on ? 'on' : 'off'), {
      headers: { Token: this.props.navigation.state.params.token }
    }).catch(error => {
      this.setState({
        toggleButtonActive: true
      });
      alert(error);
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
          title={this.state.on ? 'On' : 'Off'}
          onPress={this.fireToggleRequest}
          disabled={!this.state.toggleButtonActive}
          color={this.state.on ? 'green' : 'red'}
        />
        <Text>Current temp: {this.state.temp}</Text>
        <Text>Current humid: {this.state.humid}</Text>
        <Button title="Logout" onPress={this.logout} />
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
