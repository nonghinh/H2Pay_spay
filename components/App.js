import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View, Navigator, AsyncStorage
} from 'react-native';

var Home = require('../components/Home');
var QRCode = require('../components/QRCode');
var Login = require('../components/login/Login');
var WelCome= require('../components/WelCome');

class App extends Component{
  constructor(props){
    super(props);
    root = this;
  }

  renderScene(route, navigator){
    switch(route.name){
      case 'Home' : return(<Home scanQRCode={()=>{navigator.push({name: 'QRCode'})}} navigator={navigator} />);
      case 'QRCode' : return(<QRCode navigator={navigator} />);
      case 'Login' : return(<Login navigator={navigator} />);
      case 'WelCome' : return(<WelCome navigator={navigator} />);
    }
  }

  render(){
    return(
      <Navigator
        initialRoute={{name: 'WelCome' }}
        renderScene={this.renderScene}
      />
    );
  }
}

module.exports = App;
