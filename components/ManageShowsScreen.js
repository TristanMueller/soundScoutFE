import React from 'react';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body,Item ,Right, H1} from 'native-base';
import {View} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DrawerToggle from './DrawerToggle';
const config = require('../config/Config.json');

export default class ManageShowsScreen extends React.Component
{
    static navigationOptions = {       
        header: null,
        title: 'Manage Your Shows'};
    constructor(props){
        super(props);
        this.state = {
            shows: [],
            loadingSpinner:null,
        }
    }
    componentDidMount()
    {
        this.getShows();
    }
    render(){
        return(
            <Container>
                <View style = {{ height: '100%',paddingTop:"10%"}}>
                    <View style={{flexDirection:"row"}}>
                    <View>
                        <DrawerToggle/>
                    </View>
                    <H1 style={{alignSelf:"center",justifyContent:"center"}}>Manage Shows</H1>
                    <Button 
                    style={{position: "absolute", bottom: 10, right: 10,flex:1}}
                    dark
                    onPress = {() => this.getShows()}
                    >
                        <Text>Refresh</Text>
                    </Button>
                    </View>
                    <Container>
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
        fetch(config.url + "/api/Show/GetListBySession?session_id=" + global.session_id)
        .then(text=>text.json())
        .then(obj =>{
            var shows = [];
            if(obj.result.length == 0)
            {
                shows.push(<View key="No show message" style={{alignItems:"center"}}><H1>You havent posted any shows!</H1></View>);
            }
            for(i = 0; i < obj.result.length; i++ )
            {
                var show = obj.result[i];
                shows.push(        
                    this.renderShow(show)
                );
            }
            this.setState({shows});
        })
        .catch(ex => console.log(ex));
    }
    renderShow =(show) =>{
        return(
            <Content
                key = {show.id}
            >
                <Card>
                    <Item>
                        <Left>
                            <Text>{show.title}</Text>
                        </Left>
                        <Right>
                            <Button
                                dark
                                onPress = {() => this.deleteShow(show.id)}
                            >
                                <Text>Remove</Text>
                            </Button>
                        </Right>
                    </Item>
                </Card>
            </Content>
        );
    }
    deleteShow = async (Id) => {
        fetch(config.url + '/api/Show/Delete?session_id=' + global.session_id + '&Id=' + Id)
        .then(()=> this.getShows());
        
    }
}