import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View, TouchableOpacity, AsyncStorage, Image,NetInfo,
} from 'react-native';

var root;
class WelCome extends Component{
  constructor(props){
    super(props);
    root = this;
  }
  componentDidMount(){
    NetInfo.isConnected.fetch().then(isConnected => {
      if(isConnected){
        setTimeout(()=>{
          root.checkData();
        }, 1000);
      }
      else{
        Alert.alert(
          'Chú ý',
          'Ứng dụng cần kết nối internet, vui lòng bật lại ứng dụng khi có internet',
          [
            {text: 'OK', onPress: root.exitApp()},
          ],
          { cancelable: false }
        )
      }
    });
  }

  exitApp(){
    BackAndroid.exitApp();
  }

  async checkData(){
    let accessToken = await AsyncStorage.getItem('access_token');
    if(accessToken == null){
      root.props.navigator.push({name: 'Login'});
    }
    else{
      console.log('HOMEEEEEE: '+accessToken);
      root.props.navigator.push({name: 'Home'});
    }
  }

  render(){
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={require('../images/logo.png')} />
        <Image source={require('../images/name.png')} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading:{
    alignItems: 'center',
    justifyContent: 'center',
  },
})
module.exports = WelCome;
