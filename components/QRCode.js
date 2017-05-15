import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text, TouchableOpacity, BackAndroid, AsyncStorage,
  View, Dimensions, TouchableHighlight, Alert, Modal,
} from 'react-native';

import Camera from 'react-native-camera';
import io from 'socket.io-client/dist/socket.io.js';
import base64 from 'base-64';

var $this;

class QRCode extends Component{
  constructor(props){
    super(props);
    $this = this;
    this.state = {
      modalVisible: false,
      dataJson: {},
      dataPayment: ''
    }
    this.socket = io('https://ancient-thicket-58596.herokuapp.com', {jsonp: false});
    this.socket.on('serverReply', function(msg, status){
      $this._onAlert(msg);
    });
  }
  componentDidMount(){
    BackAndroid.addEventListener('hardwareBackPress', function() {
      $this.setState({
        modalVisible: false
      });
      $this.props.navigator.pop({name: 'Home'});
    });

  }

  _onAlert(msg){
    return (
      Alert.alert(
        'Thông báo', msg,
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      )
    )
  }

  _onBarCodeRead(result){
    var data = result.data;
    var textData = base64.decode(data);
    $this.setState({
      dataPayment: data,
      dataJson: JSON.parse(textData),
      modalVisible: true,
    });

  }
  onCanceled(){
    $this.setState({
      modalVisible: false
    });
    $this.props.navigator.pop({name: 'Home'});
  }

  async onAccepted(){
    const access_token = await AsyncStorage.getItem('access_token');
    console.log('data payment:'+$this.state.dataPayment);
    $this.socket.emit('clientPay',{access_token: access_token, dataPayment: $this.state.dataPayment});
    $this.setState({
      modalVisible: false
    });
    $this.props.navigator.pop({name: 'Home'});
  }

  render(){
    return(
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
          onBarCodeRead={this._onBarCodeRead} >
          <View style={styles.rectangleContainer}>
            <View style={styles.rectangle}/>
          </View>
        </Camera>
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}} >
          <View style={styles.overlayModal}>
            <View style={styles.modalData}>
              <View style={styles.modalHeader}>
                <Text style={styles.textHeader}>Thông tin thanh toán</Text>
              </View>
              <View style={styles.modalBody}>
                <View style={styles.textRow}>
                  <Text style={styles.textLabel}>Sản phẩm:</Text><Text style={styles.textData}>{this.state.dataJson.product_name}</Text>
                </View>
                <View style={styles.textRow}>
                  <Text style={styles.textLabel}>Mã sp:</Text><Text style={styles.textData}>{this.state.dataJson.product_id}</Text>
                </View>
                <View style={styles.textRow}>
                  <Text style={styles.textLabel}>Giá:</Text><Text style={styles.textData}>{this.state.dataJson.product_price}</Text>
                </View>
                <View style={styles.textRow}>
                  <Text style={styles.textLabel}>Mã máy:</Text><Text style={styles.textData}>{this.state.dataJson.case_id}</Text>
                </View>
              </View>
              <View style={styles.modalFooter}>
                <View style={styles.btnCancel}>
                  <TouchableOpacity onPress={this.onCanceled}>
                    <Text>Hủy</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.btnOk}>
                  <TouchableOpacity onPress={this.onAccepted}>
                    <Text>Thanh toán</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  rectangle: {
    height: 250,
    width: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
  },
  overlayModal:{
    backgroundColor: 'rgba(0, 0, 0, .8)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalData:{
    width: Dimensions.get('window').width *0.9,
    height: Dimensions.get('window').height *0.6,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  modalHeader:{
    height: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 4,
  },
  textHeader:{
    fontSize: 20,
  },
  modalBody:{
    borderTopWidth: 1,
    borderTopColor: '#d1d1d1',
    flex: 1,
    padding: 10,
  },
  modalFooter:{
    height: 40,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#d1d1d1',
  },
  btnCancel:{
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#d1d1d1',
    flexDirection: 'column'
  },
  btnOk:{
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  textRow:{
    flexDirection: 'row',
    paddingVertical: 2,
  },
  textLabel:{
    flex: 2,
    fontSize: 14,
  },
  textData:{
    flex: 4,
    color: '#ff5050',
    fontSize: 14,
  }
});
module.exports = QRCode;
