import React from 'react';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body,Item ,Right, Form, Input,H1} from 'native-base';
import {View} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DrawerToggle from './DrawerToggle';
const config = require('../config/Config.json');

export default class ChatScreen extends React.Component
{
    static navigationOptions = {       
        header: null,
        title: 'Chat'};
    constructor(props){
        super(props);
        this.state = {
            conversations : [],
            Conversation_Id : null,
            messages:[],
            message_to_send: '',
            sending_message:false,
            errorMessage:'',
            pending:false,
        }
        global.conversation_Id = null;
    }

    componentDidMount()
    {
        this.getConversations();
    }
    render(){
        return(
            <Container>
                <View style = {{ height: '100%'}}>
                    <View style={{paddingTop:"10%"}}>
                        <DrawerToggle style={{position: "absolute", top: 0, left: 0,flex:1}}/>
                        <Button 
                        style={{position: "absolute", bottom: 10, right: 10,flex:1}}
                        dark
                        onPress = {() => this.getConversations()}
                        >
                            <Text>Refresh</Text>
                        </Button>
                    </View>
                    <Container>
                        <Text>{this.state.errorMessage}</Text>
                        <ScrollView>
                            <Item>
                                <Input  onChangeText={(new_conversation_username) => this.setState({new_conversation_username})} placeholder="Username" value={this.state.new_conversation_username}/>
                                <Button dark onPress ={() => this.sendCreateConversationRequest(this.state.new_conversation_username)}>
                                    <Text>Create Conversation</Text>
                                </Button>
                            </Item>
                            {this.state.conversations}
                        </ScrollView>
                    </Container>
                </View>
            </Container>
        );
        
    }
    
    getConversations = () => {
        console.log(config.url + "/api/chat/GetConversations?session_id=" + global.session_id);
        var conversations = [];
        fetch(config.url + "/api/chat/GetConversations?session_id=" + global.session_id)
        .then(text => text.json())
        .then(content => {
            for(var i= 0; i < content.result.length; i++)
            {
                var Conversation_Id = content.result[i].conversation_Id;
                var participants = [];
                for(var j=0;j<content.result[i].participant_usernames.length;j++)
                {
                    if(content.result[i].participant_usernames[j] !== global.username)
                    {
                        participants.push(
                            <Text key ={content.result[i].participant_usernames[j] + content.result[i].conversation_Id}>{content.result[i].participant_usernames[j]} </Text>
                        );
                    }
                }
                conversations.push(
                    this.renderConverstations(participants,Conversation_Id)
                );
                this.setState({conversations});
            }
        });
    }
    renderConverstations = (participants,Conversation_Id) =>{
        return(                
            <Item
                key ={Conversation_Id}
            >
            {participants}
            <Right>
                <Button
                    dark
                    onPress= {() => {
                        global.conversation_Id = Conversation_Id;
                        this.props.navigation.navigate('Conversation');
                    }}
                    >
                    <Text>Chat</Text>
                </Button>
            </Right>
        </Item>)
    }
    sendCreateConversationRequest = async () =>
    {
        this.setState({pending:true});
        console.log(config.url + "/api/chat/CreateConversations?session_id=" + global.session_id + "&username=" + this.state.new_conversation_username);
        fetch(config.url + "/api/chat/CreateConversations?session_id=" + global.session_id + "&other_participant_username=" + this.state.new_conversation_username)
        .then(text => text.json())
        .then(obj =>{
            if(obj.isSuccess === true){
                this.getConversations();
            }else{
                this.setState({errorMessage:obj.errorMessage});
            }
        });
        this.setState({new_conversation_username:''});
        this.setState({pending:false});
    }
}

