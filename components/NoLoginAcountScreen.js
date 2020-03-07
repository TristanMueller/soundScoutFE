import * as FileSystem from 'expo-file-system';
import Axios from 'axios';
import * as Permissions from 'expo-permissions';
import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Image, View, Keyboard } from 'react-native';
import {TouchableOpacity } from 'react-native-gesture-handler';
import DrawerToggle from './DrawerToggle';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right,Item, Input,Textarea, Form, H3,H2,H1,Toast,Root} from 'native-base';
const config = require('../config/Config.json');
import Constants from 'expo-constants';
import {createStackNavigator } from 'react-navigation-stack'
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import {  createAppContainer } from 'react-navigation'; 
import { withNavigation } from 'react-navigation';

export default withNavigation(class NoLoginAccountScreen extends React.Component{
    static navigationOptions = { header: null};

    constructor(props){
        super(props);
    }
    state = {
      profile_picture: 'https://filestoragesoundscout.blob.core.windows.net/profile-pictures/' + global.username ,
      profile_video: 'https://filestoragesoundscout.blob.core.windows.net/profile-videos/' + global.username +".mp4",
      city: '',
      state:'',
      profile_description:'',
      customer_type: 0,
    };
    render(){

        return(
            <Container>
                <View style = {{ height: '100%'}}>
                    <View style={{paddingTop:"10%"}}>
                        <DrawerToggle/>
                    </View>
                    <Container style={{justifyContent:"center",alignItems:"center"}}>
                        <Image source={require('../assets/Logo.jpg')} style={{height:200,width:200}}></Image>
                        <View style={{paddingTop:"2%"}}>
                            <Button dark onPress={() =>{
                                this.props.navigation.navigate('Login');
                            }}>
                                <Text>
                                Login  
                                </Text>
                            </Button>
                        </View>
                        <View style={{paddingTop:"2%"}}>
                            <Button dark onPress={() =>{
                                this.props.navigation.navigate('SignUp');
                            }}>
                                <Text>
                                Sign Up
                                </Text>
                            </Button>
                        </View>
                    </Container>

                </View>
            </Container>

            );
    }
});