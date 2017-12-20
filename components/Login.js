import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import firebase from 'firebase';
import Axios from 'axios';

export default class App extends React.Component {
  static navigationOptions = {
    title: 'Login',
    loginButtonActive: true
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
        <Button
          title="Login"
          onPress={this.login}
          disabled={!this.state.loginButtonActive}
        />
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
