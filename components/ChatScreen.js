import React from 'react';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body,Item ,Right, Form, Input,H1} from 'native-base';
import {View} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DrawerToggle from './DrawerToggle';
const config = require('../config/Config.json');
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


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
        
    }

    componentDidMount()
    {
        global.ws = new WebSocket(config.url_websocket);

        ws.onopen = () => {
            this.sendGetConversationRequest();
        };

        global.ws.onmessage = e => {
            var message = JSON.parse(e.data);
            if(message.action_type == "send_message")
            {
                //do nothing
            }
            else if(message.action_type =="get_conversations")
            {
                this.getConversations(message.content);
            }   
            else if(message.action_type == "get_messages")
            {
                this.getMessage(message.content.result);
            }
            else if(message.action_type == "create_conversation")
            {
                this.newConversation(message.content);
            }
        };

        global.ws.onerror = e => {
        // an error occurred
            console.log("ws error");
        };

        global.ws.onclose = e => {
        // connection closed
            console.log("ws close");
        };
    }
    render(){
        if(this.state.Conversation_Id == null)
        {
            return(
                <Container>
                    <View style = {{ height: '100%'}}>
                        <View style={{paddingTop:"10%"}}>
                            <DrawerToggle style={{position: "absolute", top: 0, left: 0,flex:1}}/>
                            <Button 
                            style={{position: "absolute", bottom: 10, right: 10,flex:1}}
                            dark
                            onPress = {() => this.sendGetConversationRequest()}
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
        else
        {
            return(
                <Container>
                    <View style = {{height: '100%'}}>
                        <View style={{paddingTop:"20%"}}>
                            <Button 
                                style={{position: "absolute", bottom: 0, left: 0,flex:1}}
                                dark
                                onPress = {() => this.setState({Conversation_Id:null})}
                            >
                                <Text>Go back</Text>
                            </Button>
                        </View>
                        <Container>
                            <KeyboardAwareScrollView
                                scrollToOverflowEnabled 
                                scrollEnabled={true}
                                ref='message_view'
                            >
                                {this.state.messages}
                                <Item>
                                    <Input placeholder="Message" onChangeText={(message_to_send) => this.setState({message_to_send})} clearTextOnFocus={true} value={this.state.message_to_send}/>
                                    <Right><Button dark onPress ={() => {
                                        this.sendSendMessageRequest(this.state.Conversation_Id,this.state.message_to_send);
                                        this.state.messages.push(<Item style = {{backgroundColor:'#96df6d', padding:10}}><Right><Text>{this.state.message_to_send}</Text></Right></Item>);
                                        this.setState({message_to_send:''});
                                        }}><Text>Send</Text></Button></Right>
                                </Item>
                            </KeyboardAwareScrollView>
                            <View style = {{width:"100%",height:20}}></View>
                        </Container>
                    </View>
                </Container>
            );
        }
    }
    
    getConversations = async (content) => {
        var conversations = [];
        for(i= 0; i<content.result.length; i++)
        {
            var Conversation_Id = content.result[i].Conversation_Id;
            var participants = [];
            for(j=0;j<content.result[i].participant_usernames.length;j++)
            {
                if(content.result[i].participant_usernames[j] !== global.username)
                {
                    participants.push(
                        <Text key ={content.result[i].participant_usernames[j] + content.result[i].Conversation_Id}>{content.result[i].participant_usernames[j]} </Text>
                    );
                }
            }
            conversations.push(
                this.renderConverstations(participants,Conversation_Id,i)
            );
            this.setState({conversations});
        }
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
                        this.setState({Conversation_Id:Conversation_Id});
                        this.sendGetMessageRequest(Conversation_Id);
                    }}
                    >
                    <Text>Chat</Text>
                </Button>
            </Right>
        </Item>)
    }
    sendGetConversationRequest = async () => {
        global.ws.send('{"action_type":"get_conversations","content":{"session_id":"' + global.session_id + '"}}');
    }
    sendGetMessageRequest = async (Conversation_Id) => {
        global.ws.send('{"action_type":"get_messages","content":{"session_id":"' + global.session_id + '","Conversation_Id":"' + Conversation_Id + '"}}');
    }
    sendSendMessageRequest = async (Conversation_Id,message) =>
    {
        global.ws.send('{"action_type":"send_message","content":{"session_id":"' + global.session_id + '","Conversation_Id":"' + Conversation_Id + '","message":"' + message + '"}}');
    }
    sendCreateConversationRequest = async (username) =>
    {
        this.setState({pending:true});
        global.ws.send('{"action_type":"create_conversation","content":{"session_id":"' + global.session_id + '","username":"' + username + '"}}');
        this.setState({new_conversation_username:''});
        this.setState({pending:false});
    }
    newConversation = async (content) => {
        if(content.isSuccess==true)
        {
            this.setState({Conversation_Id:content.result});
            this.sendGetMessageRequest(content.result);
        }
        else
        {
            this.setState({errorMessage:content.errorMessage });
        }

    }
    getMessage = async (result) => {
        var messages  = [];
        for(i = 0;i <result.length; i++)
        {
            if(result[i].sender_username == global.username)
            {
                messages.push(<Item style = {{backgroundColor:'#96df6d', padding:10}}><Right><Text>{result[i].content}</Text></Right></Item>);
            }else{
                messages.push(<Item style = {{backgroundColor:'#AFCFDA', padding:10}}><Left><Text>{result[i].content}</Text></Left></Item>);
            }
        }
        this.setState({messages});
        setTimeout(() => { 
            try{
                this.refs.message_view.scrollToEnd({animated: true});
            }catch(ex){
                console.log(ex);
            }
        }, 100);
        setTimeout(() => { 
            if(this.state.Conversation_Id != null)
            {
                this.sendGetMessageRequest(this.state.Conversation_Id);
            }
        }, 3000);
    }
}

