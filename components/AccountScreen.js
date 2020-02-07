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

export default class AccountScreen extends React.Component {
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

    render()
    {
      return(
        <Root>
          <Container>
              <View style={{paddingTop:"10%"}}>
                <DrawerToggle style={{position: "absolute", top: 0, left: 0,flex:1}}/>
                <Button
                  style={{position: "absolute", bottom: 10, right: 10,flex:1}}
                  dark
                  onPress = {() => {
                    global.session_id = null;
                    global.username = null;
                    this.props.navigation.navigate('Login');
                  }}
                  >
                      <Text>Logout</Text>
                  </Button>
              </View>
            <Item>
              <Left>
                <TouchableOpacity
                  onPress = {()=>this._pickImage()} 
                >
                  <Thumbnail large square source={{uri:this.state.profile_picture, cache:'reload'}} defaultSource={require('../assets/avatar.png')}/>
                </TouchableOpacity>
              </Left>
              <Right>
                <Body>
                  <H2>{global.username}</H2>
                  <Text>Located in {this.state.city}, {this.state.state}</Text>
                </Body>
              </Right>
            </Item>
            <Container>
              <Content padder>
                <H3>Profile Description</H3>
                <Textarea rowSpan={5} bordered placeholder={this.state.profile_description}  onChangeText={(profile_description) => this.setState({profile_description})} value={this.state.profile_description} />
                <Item>
                  <Button
                  dark
                  onPress = {() => {
                    this.updateDescription();
                    Keyboard.dismiss();
                  }}
                  >
                    <Text>Update Description</Text>
                  </Button>
                </Item>
                <Item style= {{alignItems:'center'}}>
                  <H3>Profile Type</H3>
                </Item>
                <Item>
                  <Left>
                    <Button dark onPress = {() => this.updateCustomerType(0)}>
                      <Text>Normal</Text>
                      {this.state.customer_type == 0 ? <Icon name='checkmark-circle' /> : <Icon name='close-circle' />}
                    </Button>
                  </Left>
                    <Text>Find local shows</Text>
                </Item>
                <Item>
                  <Left>
                    <Button dark onPress = {() => this.updateCustomerType(1)}>
                      <Text>Artists</Text>
                      {this.state.customer_type == 1 ? <Icon name='checkmark-circle' /> : <Icon name='close-circle' />}
                    </Button>
                  </Left>
                    <Text>Find venues</Text>
                </Item>
                <Item>
                  <Left>
                    <Button dark onPress = {() => this.updateCustomerType(2)}>
                      <Text>Venues</Text>
                      {this.state.customer_type == 2 ? <Icon name='checkmark-circle' /> : <Icon name='close-circle' />}
                    </Button>
                  </Left>
                    <Text>Find shows and musicians</Text>
                </Item>
                <Item>
                  <Input  onChangeText={(city) => this.setState({city})} placeholder="City"/>
                  <Input  onChangeText={(state) => this.setState({state})} placeholder="State" />
                <Button dark onPress = {() => this.updateLocation()}>
                      <Text>Update Location</Text>
                  </Button>
                </Item>
                {this.state.customer_type == 1 ? <Item><Button  dark onPress = {() => this._pickVideo()}><Text>Add Music Demo</Text></Button></Item>: <Item></Item>}
                {this.state.customer_type ==1 ?
                <Item>
                  <Video
                    source={{ uri: this.state.profile_video,cache:"reload" }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    useNativeControls
                    resizeMode = {Video.RESIZE_MODE_STRETCH}
                    style={{ width:"100%",height:200}}
                  />
                  </Item>
                  :
                  <Item></Item>
                }
              </Content>
            </Container>
          </Container>
        </Root>
      );
    }

    componentDidMount() {
      if(!(global.username =="" || global.username ==null))
      {
        this.getPermissionAsync();
        this.getUserInformation();
      }
  
    }

    getPermissionAsync = async () => {
      if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to add a profile picture and video!');
        }
      }
    }

    _pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (!result.cancelled) {
        this.setState({ profile_picture: result.uri });
        await this.fileuploader();
      }
    };
    fileuploader = async () => {
      const fileInfo = await FileSystem.getInfoAsync(this.state.profile_picture);
      if (fileInfo.exists) {
        let fileString = await FileSystem.readAsStringAsync(this.state.profile_picture, { encoding: FileSystem.EncodingType.Base64  });
        let JsonString =  '{"data":"' + fileString + '","session_id":"' + global.session_id + '"}';
        let options = {
          headers: {
            'Content-Type': "application/json",
          }
        }
        Axios.post(config.url + '/api/FileUploading/SetProfilePicture',JsonString, options)
        .then(() => {Toast.show({
            text: 'Profile picture uploaded',
            buttonText: 'Okay',
            duration: 3000,
            position:'top',
            type: "success"
          });
        })
        .catch(()=>Toast.show({
          text: 'Profile picture failed to upload',
          buttonText: 'Okay',
          duration: 3000,
          position:'top',
          type: "danger"
        }));
      }
    }
    _pickVideo = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.cancelled) {
        Toast.show({
          text: 'Please wait for your video to upload',
          buttonText: 'Okay',
          duration: 3000,
          position:'top',
          type: "warning"
        });
        this.setState({ profile_video: result.uri });
        this.videouploader();
      }
    };
    videouploader = async () => {
      const fileInfo = await FileSystem.getInfoAsync(this.state.profile_video);
      if (fileInfo.exists) {
        let fileString = await FileSystem.readAsStringAsync(this.state.profile_video, { encoding: FileSystem.EncodingType.Base64  });
        let JsonString =  '{"data":"' + fileString + '","session_id":"' + global.session_id + '"}';
        let options = {
          headers: {
            'Content-Type': "application/json",
          }
        }
        Axios.post(config.url + '/api/VideoUploading/SetProfileVideo',JsonString, options)
        .then(() => {Toast.show({
            text: 'Profile video uploaded',
            buttonText: 'Okay',
            duration: 3000,
            position:'top',
            type: "success"
          });
        })
        .catch(()=>Toast.show({
          text: 'Profile video failed to upload',
          buttonText: 'Okay',
          duration: 3000,
          position:'top',
          type: "danger"
        }));
      }
    }
    getUserInformation = async () => {
      fetch(config.url +'/api/Account/GetPublicInfo?username=' + global.username)
      .then(text => text.json())
      .then(obj => {
        this.setState({ city: obj.city });
        this.setState({ state: obj.state });
        this.setState({ profile_description: obj.profile_description });
        this.setState({ customer_type: obj.customer_type });
      })
      .catch(ex => console.log(ex));
    }
    updateLocation = async () => {
      fetch(config.url + '/api/Location?session_id=' + global.session_id + '&city=' + this.state.city + '&state=' + this.state.state)
      .then(res => res.text())
      .then(body => JSON.parse(body))
      .then(obj =>{
        if(obj.isSuccess){
          Toast.show({
            text: 'Updated profile location',
            buttonText: 'Okay',
            duration: 3000,
            position:'top',
            type: "success"
          });
        }else{
          Toast.show({
            text: 'Failed to update profile location',
            buttonText: 'Okay',
            duration: 3000,
            position:'top',
            type: "danger"
          });
        }
      })
      .catch(()=>Toast.show({
        text: 'Failed to update profile location',
        buttonText: 'Okay',
        duration: 3000,
        position:'top',
        type: "danger"
      }));
    }
    updateDescription = async () => {
      fetch(config.url + '/api/Account/SetProfileDescription?session_id=' + global.session_id + '&profile_description=' + this.state.profile_description)
      .then(res => res.text())
      .then(body => JSON.parse(body))
      .then(obj =>{
        if(obj.isSuccess){
          Toast.show({
            text: 'Updated profile description',
            buttonText: 'Okay',
            duration: 3000,
            position:'top',
            type: "success"
          });
        }else{
          Toast.show({
            text: 'Failed to update profile description',
            buttonText: 'Okay',
            duration: 3000,
            position:'top',
            type: "danger"
          });
        }
      })
      .catch(()=>Toast.show({
        text: 'Failed to update profile description',
        buttonText: 'Okay',
        duration: 3000,
        position:'top',
        type: "danger"
      }));
    }
    updateCustomerType = async (customer_type) => {
      fetch(config.url + '/api/Account/SetCustomerType?session_id=' + global.session_id + '&customer_type=' + customer_type)
      .then(res => res.text())
      .then(body => JSON.parse(body))
      .then(obj =>{
        if(obj.isSuccess){
          Toast.show({
            text: 'Updated profile type',
            buttonText: 'Okay',
            duration: 3000,
            position:'top',
            type: "success"
          });
        }else{
          Toast.show({
            text: 'Failed to update profile type',
            buttonText: 'Okay',
            duration: 3000,
            position:'top',
            type: "danger"
          });
        }
      })
      .catch(()=>Toast.show({
        text: 'Failed to update profile type',
        buttonText: 'Okay',
        duration: 3000,
        position:'top',
        type: "danger"
      }));
      this.setState({customer_type: customer_type});
    }
  }