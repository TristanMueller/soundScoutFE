import React from 'react';
import DrawerToggle from './DrawerToggle';
import { Image, View } from 'react-native';
import {Button, H1, Item,Text,Container} from 'native-base';

export default class InfoScreen extends React.Component {
  static navigationOptions = { header: null, gesturesEnabled: false };
  constructor(props){
    super(props);
  }

  render() {

    return (
        <Container>
            <View style = {{ height: '100%'}}>
                <View style={{paddingTop:"10%"}}>
                    <DrawerToggle/>
                </View>

                <View style={{ flex: 1, alignItems: 'center'}}>
                    <H1>SoundScout{"\n"}</H1>
                    <Image source={require('../assets/Logo.jpg')} style={{height:200,width:200}}></Image>
                    <Text>{"\n"}SoundScout was made to connect Musicians, Venues, and Music Enthusiasts{"\n"}{"\n"}Please send any questions, ideas, and concerns to Tristan.Mueller@soundscoutapp.com</Text>
                </View>
            </View>
        </Container>
    );
  }

}
