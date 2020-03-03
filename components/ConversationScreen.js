import React from 'react';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body,Item ,Right, Form, Input,H1} from 'native-base';
import {View} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DrawerToggle from './DrawerToggle';
const config = require('../config/Config.json');
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class ConversationScreen extends React.Component
{
    static navigationOptions = {       
        header: null,
        title: 'Chat'};
    constructor(props){
        super(props);
        this.state = {
            isMounted : null,
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
        this._isMounted = true;
        global.ws = new WebSocket(config.url_websocket + '?session_id=' + global.session_id + '&conversation_Id=' + global.conversation_Id );

        global.ws.onopen = () => {
            this.sendGetMessageRequest();
        };

        global.ws.onmessage = e => {
            var message = JSON.parse(e.data);
            if(message.action_type == "getMessages")
            {
                this.getMessage(message.content.result);
            }
        };

        global.ws.onerror = e => {
        // an error occurred
            console.log("global.ws error");
        };

        global.ws.onclose = e => {
        // connection closed
            console.log("global.ws close");
        };
    }
    render(){
        return(
            <Container>
                <View style = {{height: '100%'}}>
                    <View style={{paddingTop:"20%"}}>
                        <Button 
                            style={{position: "absolute", bottom: 0, left: 0,flex:1}}
                            dark
                            onPress = {() => {
                                this.props.navigation.navigate('Home');
                            }}
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
                                    this.sendSendMessageRequest(this.state.message_to_send);
                                    // this.state.messages.push(<Item style = {{backgroundColor:'#96df6d', padding:10}}><Right><Text>{this.state.message_to_send}</Text></Right></Item>);
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
    componentWillUnmount(){
        this._isMounted = false;
    }
    
    sendGetMessageRequest = async () => {
        console.log('getting messages');
        global.ws.send('getMessages');
    }
    sendSendMessageRequest = async (message) =>
    {
        global.ws.send(message);
    }
    getMessage = async (result) => {
        for(var i = 0;i < result.length; i++)
        {
            if(result[i].sender_username == global.username)
            {
                this.state.messages.push(<Item key={result[i].message_sent_time} style = {{backgroundColor:'#96df6d', padding:10}}><Right><Text>{result[i].content}</Text></Right></Item>);
            }else{
                this.state.messages.push(<Item key={result[i].message_sent_time} style = {{backgroundColor:'#AFCFDA', padding:10}}><Left><Text>{result[i].content}</Text></Left></Item>);
            }
        }
        this.forceUpdate();
        setTimeout(() => { 
            try{
                this.refs.message_view.scrollToEnd({animated: true});
            }catch(ex){
                console.log(ex);
            }
        }, 100);
        setTimeout(() => { ;
            if(this._isMounted === true){
                this.sendGetMessageRequest();
            }
        }, 3000);
    }
}

