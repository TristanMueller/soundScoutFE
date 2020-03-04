import React from 'react';
import {  View, Image } from 'react-native';
import {Button, Item, Input,Text, Container} from 'native-base';
import { requestPermissionsAsync } from 'expo-location';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Axios from 'axios';
const config = require('../config/Config.json');

export default class SignUpScreen extends React.Component {
  static navigationOptions = { header: null };
  constructor(props){
    super(props);
    this.state = {
      username:'',
      password: '',
      passwordConfirmation: '',
      email: '',
      errorMessage: ''
    };
  }
  render() {
    return (
      <KeyboardAwareScrollView scrollEnabled = {false}>
        <Container>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Image source={require('../assets/Logo.jpg')} style={{height:200,width:200}}></Image>
            <Text style={{color: "#ffffff"}}>Welcome to soundScout please sign up</Text>
            <Text>
              {renderIf(this.state.username.indexOf("!") > -1 || this.state.username.indexOf("@") > -1 ||this.state.username.indexOf("#") > -1 ||this.state.username.indexOf("$") > -1||this.state.username.indexOf("%")> -1||this.state.username.indexOf("^") > -1||this.state.username.indexOf("&") > -1||this.state.username.indexOf("*") > -1||this.state.username.indexOf("/") > -1||this.state.username.indexOf("?") > -1 ||this.state.username.indexOf(";") > -1||this.state.username.indexOf(":") > -1||this.state.username.indexOf("=") > -1||this.state.username.indexOf("+") > -1,<InvalidUsernameCharacters/>)}
              {renderIf(this.state.username.length < 5 && this.state.username.length > 0 || this.state.username.length > 25 ,<UsernameFieldValidation/>)}
              {renderIf(this.state.password.length < 10 && this.state.password.length > 0|| this.state.password.length > 50 ,<PasswordFieldValidation/>)}
              {renderIf(this.state.password !== this.state.passwordConfirmation && this.state.password.length > 0 && this.state.passwordConfirmation.length > 0, <PasswordsDontMatch />)}
            </Text>
            <Text>{this.state.errorMessage}</Text>
            <Item>
              <Input  onChangeText={(username) => this.setState({username})} placeholder="Username" value={this.state.username} />
            </Item>
            <Item>
              <Input  onChangeText={(password) => this.setState({password})} placeholder="Password" secureTextEntry ={true} value={this.state.password}/>
            </Item>
            <Item>
              <Input  onChangeText={(passwordConfirmation) => this.setState({passwordConfirmation})} placeholder="Password Confirmation" secureTextEntry ={true} value={this.state.passwordConfirmation}/>
            </Item>
            <Item>
              <Input  onChangeText={(email) => this.setState({email})} placeholder="Email" value={this.state.email}/>
            </Item>
            <Item>
              <Button 
                dark
                onPress={() => SignUp(this)}
              >
                <Text>Sign Up</Text>
              </Button>
            </Item>
            <Item>
              <Button 
                dark
                onPress={() => this.props.navigation.navigate('Login')}
              >
                <Text>Go back to Login</Text>
              </Button>
            </Item>

          </View>
        </Container>
      </KeyboardAwareScrollView>
    );
  }
}
function SignUp(caller){
  if(caller.state.password !== caller.state.passwordConfirmation || caller.state.username.length <= 3 || caller.state.password.length <= 3 || caller.state.email.length <= 3){
    caller.setState({errorMessage:"Please completely fill out the form."});
    return;
  }else{ 
    caller.setState({errorMessage:""}); 
    let options = {
      headers: {
        'Content-Type': "application/json",
      }
    }
    var signupObj = {
      username:caller.state.username,
      password:caller.state.password,
      email:caller.state.email
    }
    var jsonstring = JSON.stringify(signupObj);
    Axios.post(config.url + '/api/Account/Setup',jsonstring,options)
    .then( obj => obj.data)
    .then(obj => {
      if(obj.isSuccess){
        global.username = caller.state.username;
        global.session_id = obj.result;
        caller.setState({username:''});
        caller.setState({password:''});
        caller.setState({passwordConfirmation:''});
        caller.setState({email:''});
        caller.props.navigation.navigate('Home');
      }else{
        caller.setState({errorMessage:obj.errorMessage});
      } 
    })
    .catch(()=> caller.setState({errorMessage:'Unknown error!'}));

    // fetch(config.url + '/api/Account/Setup?username=' + caller.state.username + '&password=' + caller.state.password + '&email=' + caller.state.email)
    // .then(res => res.text())
    // .then(body => JSON.parse(body))
    // .then(obj => {
    //   if(obj.isSuccess){
    //     global.username = caller.state.username;
    //     global.session_id = obj.result;
    //     caller.setState({username:''});
    //     caller.setState({password:''});
    //     caller.setState({passwordConfirmation:''});
    //     caller.setState({email:''});
    //     caller.props.navigation.navigate('Home');
    //   }else{
    //     caller.setState({errorMessage:obj.errorMessage});
    //   } 
    // })
    // .catch(()=> caller.setState({errorMessage:'Unknown error!'}));
  }

}
class InvalidUsernameCharacters extends React.Component{
  render(){
  return (<Text>Username Cant Contain Special Characters{"\n"}</Text>);
  }
}
class PasswordsDontMatch extends React.Component{
  render() {
    return (
      <Text>Passwords Dont Match{"\n"}</Text>
    );
  }
}
class UsernameFieldValidation extends React.Component{
  render() {
    return (
      <Text>Username must be between 5 and 25 characters{"\n"}</Text>
    );
  }
}
class PasswordFieldValidation extends React.Component{
  render() {
    return (
      <Text>Password must be between 10 and 50 characters{"\n"}</Text>
    );
  }
}
function renderIf(condition, content) {
  if (condition) {
      return content;
  } else {
      return null;
  }
}