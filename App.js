import React from 'react';
import {  createAppContainer } from 'react-navigation'; // Version can be specified in package.json
import {createStackNavigator } from 'react-navigation-stack' 
import SignUpScreen from './components/SignUpScreen'
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import NoLoginHomeScreen from './components/NoLoginHomeScreen';
import ConversationScreen from './components/ConversationScreen';
import PasswordResetScreen from './components/PasswordResetScreen';

const RootStack = createStackNavigator(
  {
    Login: LoginScreen,
    SignUp: SignUpScreen,
    Home: HomeScreen,
    NoLoginHome: NoLoginHomeScreen,
    Conversation: ConversationScreen,
    PasswordReset : PasswordResetScreen
  },
  {
    initialRouteName: 'NoLoginHome',
    headerMode: 'none',
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer/>
  }
}
