import React, { Component } from 'react';
import { Video } from 'expo-av';
import { ScrollView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { Container, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Input, Item, Right, H1 } from 'native-base';
import DrawerToggle from './DrawerToggle.js';
const config = require('../config/Config.json');
import {AdMobBanner} from 'expo-ads-admob';
const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

export default class FeedScreen extends Component {
  static navigationOptions = { header: null };
  constructor(props){
      super(props);
      this.state = {
        musiciansDisplayed:0,
        loading:false,
        page:0,
        perPage:5,
        musicians: [],
        offset: 0,
        distance: 30,
        city:'',
        state: '',
        noShowMessage: null,
      }
  }
  componentDidMount() {
    this.content();
  }
  content()
  {
    if(this.state.loading ==true){
      return;
    }
    this.setState({loading:true})
    fetch(config.url + '/api/Account/GetAllPublicMusicians?city=' + this.state.city + '&state=' + this.state.state + '&distance=' + this.state.distance + '&page=' + this.state.page + '&perPage=' + this.state.perPage)
    .then(res => res.text())
    .then(body => JSON.parse(body))
    .then(obj => {
      if(obj.length === 0 && this.state.page === 0){
        this.setState({noShowMessage:<Text style={{alignSelf:"center"}}>We couldn't find any musicians!</Text>});
      }
      if(obj.length > 0){
        this.setState({page:this.state.page+1});
        this.setState({noShowMessage: null});
      }
      for(var i = 0; i < obj.length; i++ )
      {
        
        if(this.state.musiciansDisplayed % 3 === 0){
          this.state.musicians.push(<View key={Math.random()}>
            <AdMobBanner
            bannerSize="fullBanner"
            adUnitID = {Platform.OS === "ios" ? config.ios_admob_banner_id: config.android_admob_banner_id}
            onDidFailToReceiveAdWithError={e=>console.log(e)} />
            </View>
          );
        }
        var musician = obj[i];
        this.state.musicians.push(
          <Content
            key = {musician.username}
          >
            <Card>
              <CardItem>
                <Left>
                    <Thumbnail source={{uri:config.profile_picture_path + musician.username, cache:'reload'}} defaultSource={require('../assets/avatar.png')} />
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
          this.setState({musiciansDisplayed:this.state.musiciansDisplayed+1});
      }
    })
    .catch(ex => console.log(ex));
    setTimeout(() => {
      this.setState({loading:false});
    }, 3000);

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
            onPress = {() => {
              this.setState({musicians:[]});
              this.setState({page:0});
              this.setState({musiciansDisplayed:0});
              setTimeout(() => {
                this.content();
              }, 100);
            }}
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
            <Right><Button dark onPress ={() => {      
              this.setState({musicians:[]});
              this.setState({page:0});
              this.setState({musiciansDisplayed:0});
              setTimeout(() => {
                this.content();
              }, 100);}}
              >
                <Text>Filter</Text></Button></Right>
          </Item>
              <ScrollView
                onScroll={({nativeEvent}) => {
                  if (isCloseToBottom(nativeEvent) && this.state.loading ===false) {
                    this.content();
                  }
                }}
                scrollEventThrottle={400}
              >
                {this.state.noShowMessage}
                {this.state.musicians}
              </ScrollView>
          </Container>
        </View>
      </Container>
    );
  }
}