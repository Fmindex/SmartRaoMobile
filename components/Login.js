import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import Axios from 'axios';
import { LinearGradient } from 'expo';
import React from 'react';
import firebase from 'firebase';

export default class App extends React.Component {
  static navigationOptions = {
    title: 'Login',
    loginButtonActive: true,
    headerTitleStyle: { color: 'white' },
    headerBackTitle: null,
    headerStyle: {
      position: 'absolute',
      backgroundColor: 'transparent',
      zIndex: -1,
      top: 0,
      left: 0,
      right: 0,
      borderBottomWidth: 0
    },
  };
  constructor() {
    super();
    console.ignoredYellowBox = ['Setting a timer'];
    this.state = {
      text: 'Please login to continue',
      username: 'naisk133@gmail.com',
      password: '123456',
      loginButtonActive: true
    };
    this.login = this.login.bind(this);
  }

  login() {
    this.setState({
      text: '',
      loginButtonActive: false
    });
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.username, this.state.password)
      .then(response => {
        this.setState({
          text: 'Login Success!',
          loginButtonActive: true
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({
          text: JSON.stringify(error),
          loginButtonActive: true
        });
      });
  }

  render() {
    return (
      <View>
      <LinearGradient start={{x: 0, y: -0.1}} end={{x: 0.5, y: 1}} colors={['#FF0000', '#FFFF00']} style={styles.background} />
        <View style={{
          flex: 1,
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}>  
          <View style={styles.container}>
            <Text style={{
              fontSize: 18,
              fontWeight: '300',
              backgroundColor: 'rgba(0, 0, 0, 0)',
              color: '#ffffff',
              letterSpacing: 0.69,
              marginBottom: 32,
            }}>
              {this.state.text}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <TextInput
                onChangeText={username =>
                  this.setState({
                    username
                  })
                }
                value={this.state.username}
                placeholder="username"
                style={styles.textInput}
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
                style={styles.textInput}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={this.login} disabled={!this.state.loginButtonActive}>
              <Text style={styles.buttonText} >LOGIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    width: '100%',
    height: '100%',
  },
  button: {
    width: 240,
    height: 44,
    borderRadius: 25,
    backgroundColor: 'rgb(255, 110, 164)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: {width: 3, height: 3},
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  textInput: {
    width: 240,
    height: 44,
    borderColor: '#ffffff',
    borderWidth: 2,
    borderRadius: 25,
    color: '#ffffff',
    paddingLeft: 30,
    paddingRight: 20,
    fontSize: 13,
    marginBottom: 20,
  },
});
