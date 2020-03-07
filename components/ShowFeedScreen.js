import React, { Component } from 'react';
import { Image, View } from 'react-native';
import DrawerToggle from './DrawerToggle';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right,Item,Input, H1,Spinner } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
const config = require('../config/Config.json');
import {Platform} from "react-native";
import {AdMobBanner, AdMobInterstitial, PublisherBanner, AdMobRewarded} from 'expo-ads-admob';
const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};


export default class ShowFeedScreen extends React.Component {
    static navigationOptions = {
      header: null,
      title: 'Shows'
    };
    constructor(props){
        super(props);
        this.state={
            shows: [],
            loading:false,
            showsDisplayed:0,
            page: 0,
            perPage: 5,
            city:'',
            state:'',
            distance:30,
            noShowMessage:null
        }
    }

    componentDidMount()
    {
      this.getShows();
    }
    
    render() {

      return(
        <Container>
          <View style = {{ height: '100%',paddingTop:"10%"}}>
            <View style={{flexDirection:"row"}}>
              <View>
                <DrawerToggle/>
              </View>
              <H1 style={{alignSelf:"center",justifyContent:"center"}}>Shows</H1>
            </View>
              <Container>
                  <Item>
                    <Input  onChangeText={(city) => this.setState({city})} placeholder= "city"/>
                    <Input keyboardType = 'numeric' onChangeText={(distance) => this.setState({distance})} placeholder= "distance (in miles)"/>
                  </Item>
                  <Item>
                    <Input  onChangeText={(state) => this.setState({state})} placeholder= "state"/>
                    <Right><Button dark  
                    onPress = {() => {
                    if(this.state.loading ==false){
                      this.setState({shows:[]});
                      this.setState({page:0});
                      this.setState({showsDisplayed:0});
                      setTimeout(() => {
                        this.getShows();
                      }, 100);
                    }
                  }}><Text>Search</Text></Button></Right>
                  </Item>
                  {this.state.loadingSpinner? <Spinner color="black"/>:null}
                  <ScrollView 
                    onScroll={({nativeEvent}) => {
                      if (isCloseToBottom(nativeEvent) && this.state.loading === false) {
                        this.getShows();
                      }
                    }}
                    scrollEventThrottle={400}
                  >
                    {this.state.shows}
                    {this.state.noShowMessage}
                  </ScrollView>
              </Container>
          </View>
        </Container>
      );
    }

    getShows = async () => {
        if(this.state.loading ==true){
          return;
        }
        this.setState({loading:true});
        fetch(config.url + "/api/Show/GetList?city=" + this.state.city +'&state=' + this.state.state + '&distance=' + this.state.distance + '&page=' + this.state.page + '&perPage=' + this.state.perPage)
        .then(text=>text.json())
        .then(obj =>{
            if(obj.result.length === 0 && this.state.page === 0){
              this.setState({noShowMessage:<Text style={{alignSelf:"center"}}>We couldn't find any shows!</Text>});
            }
            if(obj.result.length > 0){
              this.setState({page:this.state.page+1});
              this.setState({noShowMessage: null});
            }
            for(var i = 0; i < obj.result.length; i++ )
            {
                if(this.state.showsDisplayed % 3 === 0){
                  this.state.shows.push(<View key={Math.random()}>
                  <AdMobBanner
                  bannerSize="fullBanner"
                  adUnitID = {Platform.OS === "ios" ? config.ios_admob_banner_id: config.android_admob_banner_id}
                  onDidFailToReceiveAdWithError={e=>console.log(e)} />
                </View>);
                }
                var show = obj.result[i];
                this.state.shows.push(        
                  <Content
                    key= {show.id}
                  >
                    <Card>
                      <CardItem>
                        <Left>
                          <Thumbnail source={{uri:config.profile_picture_path + show.posted_username, cache:'reload'}}/>
                          <Body>
                            <Text>{show.title}</Text>
                            <Text>{show.performer_name} @ {show.venue_name}</Text>
                            <Text note>{show.street_address}, {show.city}, {show.state}</Text>
                          </Body>
                        </Left>
                      </CardItem>
                      <CardItem cardBody>
                        <Image source={{uri:config.show_picture_path + show.id}} style={{height: 200, width: null, flex: 1}}/>
                      </CardItem>
                      <CardItem>
                        <Body>
                            <Text>Start Time: {show.start_time}</Text>
                            <Text>End Time: {show.end_time}</Text>
                            <Text>{show.description}</Text>
                            <Text>{show.ticket_information}</Text>
                        </Body>
                      </CardItem>
                    </Card>
                  </Content>
                );
                this.setState({showsDisplayed:this.state.showsDisplayed+1});
            }
          })
          .catch(ex => console.log(ex));
          setTimeout(() => { 
            this.setState({loading:false})
          }, 3000);
    }
}