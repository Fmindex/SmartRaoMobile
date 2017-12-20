import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

import Axios from 'axios';
import { LinearGradient } from 'expo';
import React from 'react';
import firebase from 'firebase';

export default class App extends React.Component {
  static navigationOptions = {
    title: 'Main',
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
      text: 'Hello',
      username: 'naisk133@gmail.com',
      password: '123456',
      humid: '--',
      temp: '--',
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
  
  renderTodayCard(temp, humid) {
    return (
      <View style={styles.todayContainer}>
        <LinearGradient start={[0, 1]} end={[0, 0]} colors={['rgb(61, 182, 250)', 'rgb(130, 210, 236)']} style={[styles.todayBackground, styles.card]} />
        <View style={styles.todayContent}>
          <View style={styles.todayTemperature}>
            <View style={styles.todayMinMax}>
            <Text style={[styles.text, styles.todayMinMaxLabel]}>TEMPERATURE</Text>
              <Text style={[styles.text, styles.todayTempCurrent]}>{`${temp}˚`}</Text>
            </View>
            <View style={styles.todayMinMax}>
              <Text style={[styles.text, styles.todayMinMaxLabel]}>HUMIDITY</Text>
              <Text style={[styles.text, styles.todayTempCurrent]}>{`${humid}`} %</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  componentWillUnmount() {
    this.databaseRef.off();
  }

  fireToggleRequest() {
    const { on } = this.state;
    this.setState({
      on: !on,
    })
    // this.setState({
    //   toggleButtonActive: false
    // });
    // Axios.get(this.baseUrl + (!on ? 'on' : 'off'), {
    //   headers: { Token: this.props.navigation.state.params.token }
    // })
    //   .then(() => {
    //     this.timer = setTimeout(() => {
    //       if (!this.state.toggleButtonActive) {
    //         this.setState({
    //           toggleButtonActive: true
    //         });
    //         alert('NodeMCU is not responding, Please try again');
    //       }
    //     }, 5000);
    //   })
    //   .catch(error => {
    //     this.setState({
    //       toggleButtonActive: true
    //     });
    //     alert(error);
    //   });
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
        <LinearGradient start={[0, 1]} end={[1, 1]} colors={["#FF0000", "#FFFF00"]} style={styles.header} />
        <View style={styles.content}>
          {this.renderTodayCard(this.state.temp, this.state.humid)}
          <Button
            title={this.state.on ? 'On' : 'Off'}
            onPress={this.fireToggleRequest}
            disabled={!this.state.toggleButtonActive}
            color={this.state.on ? 'green' : 'red'}
          />
          <Button title="Logout" onPress={this.logout} />
          <Text>{JSON.stringify(this.state)}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    height: 128,
  },
  content: {
    width: '100%',
    marginTop: -48,
    paddingLeft: 16,
    paddingRight: 16,
  },
  todayContainer: {
    height: 96,
    width: '100%',
    marginBottom: 11,
  },
  card: {
    borderRadius: 16,
    shadowColor: 'rgba(201,201,201,0.5)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    marginBottom: 11,
    // overflow: 'hidden'
  },
  todayBackground: {
    height: '100%',
    width: '100%',
  },
  todayContent: {
    marginTop: -96,
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 4,
    flexDirection: 'column',
    height: '100%',
  },
  todayTitle: {
    fontSize: 21,
    color: '#ffffff',
  },
  todayTemperature: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  todayMinMax: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  todayTempCurrent: {
    fontSize: 36,
    color: '#ffffff',
  },
  todayMinMaxLabel: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 3,
    marginBottom: 3,
  },
  todayEtc: {
    paddingTop: 10,
    flexDirection: 'row',
    paddingLeft: 25,
    paddingRight: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
