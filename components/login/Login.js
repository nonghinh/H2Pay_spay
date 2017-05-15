import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text, TextInput,
  View, TouchableOpacity, Image, AsyncStorage
} from 'react-native';
import LoginForm from'./LoginForm';

var root;
class Login extends Component{
  constructor(props){
    super(props);
    root = this;
  }

  render(){
    return(
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require('../../images/payment-x2.png')} />
          <Text style={styles.title}>Thanh toán nhanh chóng</Text>
        </View>
        <View style={styles.formContainer}>
          <LoginForm navigator={this.props.navigator}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#ff0066',
    paddingBottom: 20,
  },
  logoContainer:{
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  logo:{
    width: 100,
    height: 100,
  },
  title:{
    width: 160,
    marginTop: 10,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  }
});
module.exports = Login;
