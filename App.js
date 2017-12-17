import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import firebase from 'firebase';
import Axios from 'axios';
import config from './config';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      text: 'Hello',
      username: 'naisk133@gmail.com',
      password: '123456',
      auth: 'You are not logged in yet',
      on: false,
      snapshot: {}
    };
    this.baseUrl = 'http://192.168.43.181:3000/';
    this.login = this.login.bind(this);
    this.getFirebaseToken = this.getFirebaseToken.bind(this);
    this.fireRequest = this.fireRequest.bind(this);
    this.fireToggleRequest = this.fireToggleRequest.bind(this);
  }
  componentWillMount() {
    console.log('will mount');
    firebase.initializeApp(config);
    this.databaseRef = firebase.database().ref('/');
    this.databaseRef.on('value', snapshot => {
      this.setState({
        snapshot
      });
    });
  }

  componentWillUnmount() {
    this.databaseRef.off();
  }

  login() {
    this.setState({
      text: ''
    });
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.username, this.state.password)
      .then(response => {
        this.setState({
          text: 'Login Success!'
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({
          text: JSON.stringify(error)
        });
      });
  }

  getFirebaseToken() {
    const user = firebase.auth().currentUser;
    if (user) {
      user
        .getIdToken(false)
        .then(response =>
          this.setState({
            auth: response
          })
        )
        .catch(error => {
          auth: JSON.stringify(error);
        });
    } else {
      auth: 'You are not logged in yet';
    }
  }

  fireRequest() {
    Axios.get(this.baseUrl, {
      headers: { Token: this.state.auth }
    })
      .then(response => alert(response.data))
      .catch(error => alert('Error' + error));
  }

  fireToggleRequest() {
    const { on } = this.state;
    this.setState({
      on: !on
    });
    Axios.get(this.baseUrl + (!on ? 'on' : 'off'), {
      headers: { Token: this.state.auth }
    })
      .then(({ data }) => alert(data))
      .catch(error => alert('Error' + error));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.text}</Text>
        <View style={{ flexDirection: 'row' }}>
          <TextInput
            onChangeText={username =>
              this.setState({
                username
              })
            }
            value={this.state.username}
            placeholder="username"
            style={{
              flex: 1,
              height: 50
            }}
          />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TextInput
            onChangeText={password =>
              this.setState({
                password
              })
            }
            value={this.state.password}
            placeholder="password"
            style={{
              flex: 1,
              height: 50
            }}
          />
        </View>
        <Button title="Login" onPress={this.login} />
        <Text>{this.state.auth}</Text>
        <Button title="Get Token" onPress={this.getFirebaseToken} />
        <Button title="Fire request" onPress={this.fireRequest} />
        <Button
          title={this.state.on ? 'On' : 'Off'}
          onPress={this.fireToggleRequest}
        />
        <Text>{JSON.stringify(this.state.snapshot)}</Text>
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
