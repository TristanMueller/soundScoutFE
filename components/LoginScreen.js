import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {  createAppContainer } from 'react-navigation'; // Version can be specified in package.json
import {createStackNavigator } from 'react-navigation-stack' 
import SignUpScreen from './SignUpScreen'
import HomeScreen from './HomeScreen';
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
      password: '',
      message: ''
    };
  }

  render() {

    return (
      <KeyboardAwareScrollView scrollEnabled = {false}>
        <Container>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Image source={require('../assets/Logo.jpg')} style={{height:200,width:200}}></Image>
            <Text style={{alignSelf: 'center'}}>{this.state.message}</Text>
            <Item>
              <Input  onChangeText={(username) => this.setState({username})} placeholder="Username" value={this.state.username}/>
            </Item>
            <Item>
              <Input  onChangeText={(password) => this.setState({password})} placeholder="Password" secureTextEntry ={true} value={this.state.password}/>
            </Item>
            <Item>
              <Button
                dark
                onPress={() => this.Login()}
                >
                <Text>Login</Text>
              </Button>
            </Item>
            <Item>
              <Button
                dark 
                onPress={() => this.props.navigation.navigate('SignUp')}
                >
                <Text>Sign Up</Text>
              </Button>
            </Item>
            <Item>
              <Button
                dark 
                onPress={() => this.props.navigation.navigate('PasswordReset')}
                >
                <Text>Forgot Your Password?</Text>
              </Button>
            </Item>
          </View>
        </Container>
      </KeyboardAwareScrollView>
    );
  }
  Login(){
    if(this.state.username.length > 3 && this.state.password.length > 3)
    {
      let options = {
        headers: {
          'Content-Type': "application/json",
        }
      }
      var loginObj = {
        username:this.state.username,
        password:this.state.password
      }
      var jsonstring = JSON.stringify(loginObj);
      Axios.post(config.url + '/api/login',jsonstring,options)
      .then(res => res.data)
      .then(obj => {
        if(obj.isSuccess==true)
        {
          global.session_id = obj.result;
          global.username= this.state.username;
          this.setState({username:''});
          this.setState({password:''});
          this.props.navigation.navigate('Home');
        }else{
          this.setState({message:obj.errorMessage});
        }
      })
      .catch(()=>this.setState({message:"Wrong username or password"}));
    }
  }
}
