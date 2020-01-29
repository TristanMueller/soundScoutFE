import React from 'react';
import {  createAppContainer } from 'react-navigation'; // Version can be specified in package.json
import {createStackNavigator } from 'react-navigation-stack' 
import SignUpScreen from './components/SignUpScreen'
import HomeScreen from './components/HomeScreen';
import { Image, View } from 'react-native';
const config = require('./config/Config.json');
import {Button, H1, Item, Input,Text,Icon,Thumbnail} from 'native-base';

class LoginScreen extends React.Component {
  static navigationOptions = { header: null, gesturesEnabled: false };
  constructor(props){
    super(props);
    this.state = {
      username:'',
      password: '',
      message: ''
    };
  }

  render() {

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Image source={require('./assets/Logo.jpg')} style={{height:200,width:200}}></Image>
        <Text style={{alignSelf: 'center'}}>{this.state.message}</Text>
        <Item>
          <Input  onChangeText={(username) => this.setState({username})} placeholder="Username" />
        </Item>
        <Item>
          <Input  onChangeText={(password) => this.setState({password})} placeholder="Password" />
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

      </View>
    );
  }
  Login(){
    if(this.state.username.length > 3 && this.state.password.length > 3)
    {
      fetch(config.url + '/api/login?username=' + this.state.username + '&password=' + this.state.password)
      .then(res => res.text())
      .then(body => JSON.parse(body))
      .then(obj => {
        if(obj.isSuccess==true)
        {
          global.session_id = obj.result;
          global.username= this.state.username;
          this.props.navigation.navigate('Home');
        }else{
          this.setState({message:obj.errorMessage});
        }
      })
      .catch(()=>this.setState({message:"Wrong username or password"}));
    }
  }
}

const RootStack = createStackNavigator(
  {
    Login: LoginScreen,
    SignUp: SignUpScreen,
    Home: HomeScreen
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none',
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
