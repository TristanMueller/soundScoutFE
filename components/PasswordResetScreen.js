import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Image, View } from 'react-native';
const config = require('../config/Config.json');
import {Button, H1, Item, Input,Text,Icon,Thumbnail,Root,Container} from 'native-base';
import Axios from 'axios';

export default class LoginScreen extends React.Component {
  static navigationOptions = { header: null, gesturesEnabled: false };
  constructor(props){
    super(props);
    global.session_id = "";
    global.username = "";
    this.state = {
      username:'',
      sentEmail:false,
      token: '',
      newPassword:''
    };
  }

  render() {
    if(this.state.sentEmail){
        return (
            <KeyboardAwareScrollView scrollEnabled = {false}>  
              <Container>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                  <Image source={require('../assets/Logo.jpg')} style={{height:200,width:200}}></Image>
                  <Text style={{alignSelf: 'center'}}>{this.state.message}</Text>
                  <Item>
                    <Input  onChangeText={(token) => this.setState({token})} placeholder="Email Token" value={this.state.token}/>
                  </Item>
                  <Item>
                    <Input  onChangeText={(newPassword) => this.setState({newPassword})} placeholder="New Password" value={this.state.newPassword} secureTextEntry ={true}/>
                  </Item>
                  <Item>
                    <Button
                      dark
                      onPress={() => this.ResetPassword()}
                      >
                      <Text>Reset Password</Text>
                    </Button>
                  </Item>
                </View>
              </Container>
            </KeyboardAwareScrollView>
          );
    }else{
        return (
          <KeyboardAwareScrollView>
            <Container>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Image source={require('../assets/Logo.jpg')} style={{height:200,width:200}}></Image>
                <Text style={{alignSelf: 'center'}}>{this.state.message}</Text>
                <Text>Password Reset</Text>
                <Item>
                  <Input  onChangeText={(username) => this.setState({username})} placeholder="Username" value={this.state.username}/>
                </Item>
                <Item>
                  <Button
                    dark
                    onPress={() => this.SendPasswordResetEmail()}
                    >
                    <Text>Send Password Reset Email</Text>
                  </Button>
                </Item>
              </View>
            </Container>
          </KeyboardAwareScrollView>
        );
    }
  }
  ResetPassword(){
    if(this.state.username.length > 3 && this.state.newPassword.length > 3)
    {
      let options = {
        headers: {
          'Content-Type': "application/json",
        }
      }
      var signupObj = {
        username:this.state.username,
        newPassword:this.state.newPassword,
        token:this.state.token
      }
      var jsonstring = JSON.stringify(signupObj);
      Axios.post(config.url + '/api/PasswordReset/ResetPassword',jsonstring,options)
      .then(obj => obj.data)
      .then(obj => {
        if(obj.isSuccess==true)
        {
            this.props.navigation.navigate('Login');
        }else{
          this.setState({message:obj.errorMessage});
        }
      })
      .catch(()=>this.setState({message:"Unknown Server Error"}));
    }
  }
  SendPasswordResetEmail(){
    if(this.state.username.length > 3)
    {
      fetch(config.url + '/api/PasswordReset/SendResetEmail?username=' + this.state.username)
      .then(res => res.text())
      .then(body => JSON.parse(body))
      .then(obj => {
        if(obj.isSuccess==true)
        {
            this.setState({sentEmail:true})
            this.setState({message:'The password reset token has been sent'})
        }else{
          this.setState({message:obj.errorMessage});
        }
      })
      .catch(()=>this.setState({message:"Unknown Server Error"}));
    }
  }
}
