import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,Image,
  View, TouchableOpacity, AsyncStorage, Alert
} from 'react-native';
var root;
class Home extends Component{
  constructor(props){
    super(props);
    root = this;
  }
  async acceptedLogOut(){
    try{
      await AsyncStorage.removeItem('access_token');
      root.props.navigator.push({name: 'Login'});
    }
    catch(ex){
      console.log(ex);
    }
  }
  onLogoutPressed(){
    Alert.alert( 'Bạn muốn đăng xuất?', 'Tất cả các thông tin tài khoản sẽ không được lưu lại',
              [
                {text: 'Hủy', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Đồng ý', onPress: () => root.acceptedLogOut()},
              ], { cancelable: false } );
  }
  scanQRCode(){
    root.props.navigator.push({name: 'QRCode'});
  }

  render(){
    return(
      <View style={styles.container}>
      <View style={styles.toolbar}>
        <View style={styles.btnLogout}>
          <TouchableOpacity onPress={this.onLogoutPressed}>
            <Image source={require('../images/logout.png')} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        <TouchableOpacity onPress={this.scanQRCode} >
          <View style={styles.btnScan}>
            <Text style={styles.textScan}>Quét QR code</Text>
          </View>
        </TouchableOpacity>
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#6600cc',
  },
  content:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnRead:{
    width: 200,
    height: 60,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textRead:{
    color: '#fff',
    fontSize: 22,
  },
  toolbar:{
    height: 50,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  btnLogout:{
    flex: 1,
    width: 90,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
  },
  textLogout:{
    color: '#fff',
    borderRadius: 4,
  },
  btnScan:{
    width: 150,
    height: 60,
    backgroundColor: '#4d0099',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textScan:{
    color: '#fff',
    fontSize: 20,
  }
});
module.exports = Home;
