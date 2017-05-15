import React, { Component } from 'react';
import {
  StyleSheet,
  Text, TextInput,
  View, TouchableOpacity, KeyboardAvoidingView, AsyncStorage, ActivityIndicator
} from 'react-native';

const ACCESS_TOKEN = 'access_token';
var root;
class Login extends Component{

  constructor(props){
    super(props);
    root = this;
    this.state = {
      phoneNumber: '',
      password: '',
      error: '',
      loader: 0,
    }
  }

  async storeToken(accessToken){
    try{
      await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
      root.getToken();
    }
    catch(err){
      console.log('Something wrong '+err);
    }
  }

  async getToken(){
    try{
      let token = await AsyncStorage.getItem(ACCESS_TOKEN);
      console.log('Token is: '+token);
    }
    catch(err){
      console.log('Something wrong '+err);
    }
  }
  async removeToken(){
    try{
      let token = await AsyncStorage.removeItem(ACCESS_TOKEN);
      root.getToken();
    }
    catch(err){
      console.log('Something wrong '+err);
    }
  }

  async onLoginPressed(){
    const URL= 'https://ancient-thicket-58596.herokuapp.com/customers/loginApp';
    root.setState({loader: 1});
    try{
      let response = await fetch(URL, {
                      method: 'POST',
                      headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        phone: root.state.phoneNumber,
                        password: root.state.password
                      })
                    });
      let res = await response.text();
      if(response.status >= 200 && response.status < 300){
        let accessToken = res;
        if(res == 'wrong'){
          root.setState({loader: 0, error:'Số điện thoại hoặc mật khẩu không đúng'});
        }
        else{
          root.storeToken(accessToken);

          setTimeout(()=>{
            root.props.navigator.push({name: 'Home'});
            root.setState({loader: 0});
          }, 1000);
        }
        console.log('res Token: '+ accessToken);
      }
      else {
        let err = res;
        throw err;
      }
    }
    catch(ex){
      root.removeToken();
      root.setState({error: ex});
      console.log(ex);
    }

  }
  renderLoading(){
    return(
      <View style={styles.container}>
        <ActivityIndicator  style={styles.loading} size='large' color='#fff'/>
      </View>
    );
  }
  render(){
    if(this.state.loader == 1){
      return this.renderLoading();
    }
    return(
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <Text style={styles.textError}>{this.state.error}</Text>
        <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          underlineColorAndroid="transparent"
          keyboardType="phone-pad"
          onSubmitEdting={()=>this.passwordInput.focus()}
          returnKeyType="next"
          onChangeText={(val)=>{this.setState({phoneNumber: val})}}/>
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          returnKeyType="go"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          underlineColorAndroid="transparent"
          secureTextEntry
          ref={(input) => this.passwordInput = input}
          onChangeText={(val)=>{this.setState({password: val})}}/>

        <TouchableOpacity onPress={this.onLoginPressed} style={styles.btnContainer}>
          <Text style={styles.btnText}>Đăng nhập</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    padding: 20,
  },
  input:{
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 20,
    color: '#fff',
    paddingHorizontal: 10
  },
  btnContainer:{
    backgroundColor: '#b30047',
    paddingVertical: 15,
  },
  btnText:{
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700'
  },
  loading:{
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 100,
  },
  textError:{
    color: '#ffcc66',
    marginBottom: 15,
  }
});
module.exports = Login;
