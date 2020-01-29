import React, { Component } from 'react';
import { Video } from 'expo-av';
import { ScrollView } from 'react-native-gesture-handler';
import { Image, View } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Input, Item, Right, H1 } from 'native-base';
import DrawerToggle from './DrawerToggle.js';
const config = require('../config/Config.json');

export default class FeedScreen extends Component {
  static navigationOptions = { header: null };
  constructor(props){
      super(props);
      this.state = {
        musicians: [],
        offset: 0,
        distance: 30,
        city:'',
        state: '',
      }
  }
  componentDidMount() {
    this.content();
  }
  content()
  {
    var newContent = [];
    fetch(config.url + '/api/Account/GetAllPublicMusicians?city=' + this.state.city + '&state=' + this.state.state + '&distance=' + this.state.distance)
    .then(res => res.text())
    .then(body => JSON.parse(body))
    .then(obj => {
      for(i = 0; i < obj.length; i++ )
      {
        musician = obj[i];
        newContent.push(
          <Content
            key = {musician.username}
          >
            <Card>
              <CardItem>
                <Left>
                  <Thumbnail source={{uri:config.profile_picture_path + musician.username, cache:'reload'}}/>
                  <Body>
                    <Text>{musician.username}</Text>
                    <Text note> {musician.city}, {musician.state}</Text>
                  </Body>
                </Left>
              </CardItem>
                <Video
                  source={{ uri: config.profile_video_path + musician.username + ".mp4",cache:"reload" }}
                  rate={1.0}
                  volume={1.0}
                  isMuted={false}
                  useNativeControls
                  resizeMode = {Video.RESIZE_MODE_STRETCH}
                  style={{ width:"100%",height:200}}
                />
              <CardItem>
                <Body>
                    <Text>{musician.profile_description}</Text>
                </Body>
              </CardItem>
            </Card>
          </Content>
          );
      }
      this.setState({musicians:  newContent});
    })
    .catch(ex => console.log(ex));
  }
          
  render() {
    return (
      <Container>
        <View style = {{ height: '100%'}}>
          <View style={{paddingTop:"10%"}}>
            <DrawerToggle style={{position: "absolute", top: 0, left: 0,flex:1}}/>
            <Button 
            style={{position: "absolute", bottom: 10, right: 10,flex:1}}
            dark
            onPress = {() => this.content()}
            >
                <Text>Refresh</Text>
            </Button>
          </View>
          <Container>
          <Item>
            <Input  onChangeText={(city) => this.setState({city})} placeholder= "city"/>
            <Input keyboardType = 'numeric' onChangeText={(distance) => this.setState({distance})} placeholder= "distance (in miles)"/>
          </Item>
          <Item>
            <Input  onChangeText={(state) => this.setState({state})} placeholder= "state"/>
            <Right><Button dark onPress ={() => this.content()}><Text>Filter</Text></Button></Right>
          </Item>
              <ScrollView>
                  {this.state.musicians}
              </ScrollView>
          </Container>
        </View>
      </Container>
    );
  }
}