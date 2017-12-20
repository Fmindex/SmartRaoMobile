import { Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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

  renderAlertCard(status, onPress, disabled) {
    let backColor = status ? 'rgba(140, 193, 79, 0.64)' : 'rgba(247, 102, 73, 0.64)';
    if(disabled) {
      return (
        <TouchableOpacity 
          style={[styles.card, {flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 64, backgroundColor: 'rgba(175, 175, 175, 0.3)'}]} 
          onPress={onPress}
          disabled={disabled}
        >
          <Text style={{marginTop: 2, fontSize: 16, color: 'white'}}>{`Loading...`}</Text>
        </TouchableOpacity>
      );
    }
    else {
      return (
        <TouchableOpacity 
          style={[styles.card, {flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 64, backgroundColor: backColor}]} 
          onPress={onPress}
          disabled={disabled}
        >
          <Text style={{marginTop: 2, fontSize: 16, color: 'white'}}>{`${status ? 'Manual' : 'Auto'}`}</Text>
        </TouchableOpacity>
      );
    }
  }

  renderStatusCard(status, onPress, disabled) {
    let cardStyles = {
      tabContainer: {
        flexDirection: 'row', 
        height: 48
      },
      tab: { 
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderColor: 'rgba(155, 155, 155, 0.2)' 
      },
      textButton: { 
        marginLeft: 12, 
        fontSize: 24, 
        letterSpacing: 0.17, 
        textAlign: "center", 
        color: "#4a4a4a" 
      },
    }
    let color = status ? 'rgba(201, 0, 0, 0.5)' : 'rgba(0, 201, 0 ,0.5)'
    return (
      <TouchableOpacity onPress={ onPress } style={[{
        borderRadius: 16,
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        marginBottom: 11,
      }, 
      {
        height: 192, 
        justifyContent: 'center', 
        flexDirection: 'column',}
      ]}>
        <View style={ cardStyles.tabContainer } >
        <TouchableOpacity style={{ flex: 1 }} disabled={!disabled}>
          <View style={[cardStyles.tab]} >
            { disabled && !status && <Image source={ require('./power-on.png') } style={{ width: 28, width: 28 }} /> }
            { disabled && status && <Image source={ require('./power-off.png') } style={{ width: 28, width: 28 }} /> }
            <Text style={ cardStyles.textButton } >
              { disabled ? (!status ? 'ON' : 'OFF') : 'Loading...' }
            </Text>
          </View>
        </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  componentWillUnmount() {
    this.databaseRef.off();
  }

  fireToggleRequest() {
    const { on } = this.state;
    // this.setState({
    //   on: !on,
    // })
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
    // this.setState({
    //   manual: !manual
    // })
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
        <LinearGradient start={[0, 1]} end={[1, 1]} colors={["#FF0000", "#FFFF00"]} style={styles.header} />
        <View style={styles.content}>
          {this.renderTodayCard(this.state.temp, this.state.humid)}
          {this.renderStatusCard(this.state.on, this.fireToggleRequest, this.state.toggleButtonActive)}
          {this.renderAlertCard(this.state.manual, this.manualToggleRequest, !this.state.manualButtonActive)}
          <View style={{ width: '100%', alignItems: 'center' }}>
            <TouchableOpacity style={styles.button} onPress={this.logout}>
              <Text style={styles.buttonText}>LOGOUT</Text>
            </TouchableOpacity>
          </View>
          <Text>{/*JSON.stringify(this.state)*/}</Text>
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
  button: {
    width: 192,
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
});
