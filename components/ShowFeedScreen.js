import React, { Component } from 'react';
import { Image, View } from 'react-native';
import DrawerToggle from './DrawerToggle';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right,Item,Input, H1,Spinner } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
const config = require('../config/Config.json');

export default class ShowFeedScreen extends React.Component {
    static navigationOptions = {
      header: null,
      title: 'Shows'
    };
    constructor(props){
        super(props);
        this.state={
            shows: [],
            city:'',
            state:'',
            distance:30,
        }
    }

    componentDidMount()
    {
      this.getShows();
    }
    
    render() {

      return(
        <Container>
          <View style = {{ height: '100%'}}>
              <View style={{paddingTop:"10%"}}>
                  <DrawerToggle style={{position: "absolute", top: 0, left: 0,flex:1}}/>
                  <Button 
                  style={{position: "absolute", bottom: 10, right: 10,flex:1}}
                  dark
                  onPress = {() => this.getShows()}
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
                    <Right><Button dark onPress ={() => this.getShows()}><Text>Filter</Text></Button></Right>
                  </Item>
                  {this.state.loadingSpinner? <Spinner color="black"/>:null}
                  <ScrollView>
                      {this.state.shows}
                  </ScrollView>
              </Container>
          </View>
        </Container>
      );
    }

    getShows = async () => {
        this.setState({shows:[]});
        fetch(config.url + "/api/Show/GetList?city=" + this.state.city +'&state=' + this.state.state + '&distance=' + this.state.distance)
        .then(text=>text.json())
        .then(obj =>{
            var shows = [];
            for(i = 0; i < obj.result.length; i++ )
            {
                var show = obj.result[i];
                shows.push(        
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
            }
            this.setState({shows});
        })
        .catch(ex => console.log(ex));
    }
}