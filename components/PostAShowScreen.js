import React from 'react';
import { View,ScrollView } from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
\import {Button, H1, Item, Input,Text,Icon,Thumbnail, Container,Spinner,Toast,Root,Picker} from 'native-base';
import DrawerToggle from './DrawerToggle';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
const config = require('../config/Config.json');
import Axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
const yearRegex = new RegExp("^20[0-9][0-9]$");
const monthRegex = new RegExp("^[1-9]$|^1[0-2]$");
const dayRegex =  new RegExp("^[1-9]$|^[1-2][0-9]$|^[3][0-1]$");
const AMPMRegex = new RegExp("^[Aa][Mm]$|^[Pp][Mm]$");
const timeRegex = new RegExp("^[1-9]:[0-5][0-9]$|^1[0-2]:[0-5][0-9]$");


export default class PostAShowScreen extends React.Component {
    static navigationOptions = {
      header: null,
      title: 'Post a Show'
    };
    constructor(props){
        super(props);
        this.state={
          show_picture: null,
          title: '',
          street_address : '',
          city : '',
          state : '',
          performer_name : '',
          venue_name : '',
          description : '',
          ticket_information : '',
          year: null,
          month: null,
          day: null,
          show_start_time: null,
          show_start_time_minutes: null,
          show_start_time_AM_PM: null,
          show_end_time: null,
          show_end_time_minutes: null,
          show_end_time_AM_PM: null,
          postShowMessage: '',
          pending: false,
          loadingSpinner: null,
        }
    }

    
    render() {
      return(
        <Root>
          <Container>
            <KeyboardAwareScrollView
              resetScrollToCoords={{ x: 0, y: 0 }}
              scrollEnabled={false}
            >
              <View style = {{ height: '100%'}}>
                <View style={{paddingTop:"10%"}}>
                  <DrawerToggle style={{position: "absolute", top: 0, left: 0,flex:1}}/>
                </View>
                <View style = {{alignItems: 'center' }}>
                  <Item>
                    <Input onChangeText={(venue_name) => this.setState({venue_name})} placeholder="Venue Name" value={this.state.venue_name} />
                  </Item>
                  <Item>
                    <Input  onChangeText={(title) => this.setState({title})} placeholder="Title" value={this.state.title} />
                  </Item>
                  <Item>
                    <Input  onChangeText={(performer_name) => this.setState({performer_name})} placeholder="Performer Name" value={this.state.performer_name}/>
                  </Item>
                  <Item>
                    <Input onChangeText={(street_address) => this.setState({street_address})} placeholder="Street Address" value={this.state.street_address}/>
                  </Item>
                  <Item>
                    <Input  onChangeText={(city) => this.setState({city})} placeholder="City" value={this.state.city}/>
                  </Item>
                  <Item>
                    <Input  onChangeText={(state) => this.setState({state})} placeholder="State" value={this.state.state}/>
                  </Item>
                  <Item>
                    <View style={{width: "100%",flexDirection:"row"}}>
                    <View style={{width:"35%"}}>
                        <Picker
                          placeholder="Year"
                          placeholderStyle={{color:"#000000"}}
                          mode="dropdown"
                          selectedValue={this.state.year}
                          onValueChange={x => this.setState({year:x})}
                        >
                          {this.yearPickerOptions()}
                          
                        </Picker>
                      </View>
                      <View style={{width:"35%"}}>
                        <Picker
                          placeholder="Month"
                          placeholderStyle={{color:"#000000"}}
                          mode="dropdown"
                          selectedValue={this.state.month}
                          onValueChange={x => this.setState({month:x})}
                        >
                          <Picker.Item label="January" value="1" />
                          <Picker.Item label="February" value="2" />
                          <Picker.Item label="March" value="3" />
                          <Picker.Item label="April" value="4" />
                          <Picker.Item label="May" value="5" />
                          <Picker.Item label="June" value="6" />
                          <Picker.Item label="July" value="7" />
                          <Picker.Item label="August" value="8" />
                          <Picker.Item label="September" value="9" />
                          <Picker.Item label="October" value="10" />
                          <Picker.Item label="November" value="11" />
                          <Picker.Item label="December" value="12" />
                        </Picker>
                      </View>
                      <View style={{width:"35%"}}>
                        <Picker
                          placeholder="Day"
                          placeholderStyle={{color:"#000000"}}
                          mode="dropdown"
                          selectedValue={this.state.day}
                          onValueChange={x => this.setState({day:x})}
                        >
                          {this.dayPickerOptions()}
                          
                        </Picker>
                      </View>
                    </View>
                  </Item>
                  {/* <Item>
                    <Input  onChangeText={(year) => this.setState({year})} placeholder="Year" value={this.state.year}/>
                    {yearRegex.test(this.state.year) ? <Icon name='checkmark-circle' /> : <Icon name='close-circle' />}
                    <Input  onChangeText={(month) => this.setState({month})} placeholder="Month" value={this.state.month}/>
                    {monthRegex.test(this.state.month) ? <Icon name='checkmark-circle' /> : <Icon name='close-circle' />}
                    <Input  onChangeText={(day) => this.setState({day})} placeholder="Day" value={this.state.day}/>
                    {dayRegex.test(this.state.day) ? <Icon name='checkmark-circle' /> : <Icon name='close-circle' />}
                  </Item> */}
                  <Item>

                    <View style={{width: "100%",flexDirection:"row"}}>
                      <View style={{width:"35%"}}>
                        <Picker
                          placeholder="Start Hour"
                          placeholderStyle={{color:"#000000"}}
                          mode="dropdown"
                          selectedValue={this.state.show_start_time}
                          onValueChange={x => this.setState({show_start_time:x})}
                        >
                          {this.hourPickerOptions()}
                          
                        </Picker>
                      </View>
                      <View style={{width:"35%"}}>
                        <Picker
                          placeholder="Start Minutes"
                          placeholderStyle={{color:"#000000"}}
                          mode="dropdown"
                          selectedValue={this.state.show_start_time_minutes}
                          onValueChange={x => this.setState({show_start_time_minutes:x})}
                        >
                          {this.timePickerOptions()}
                          
                        </Picker>
                      </View>
                      <View style={{width:"30%"}}>
                        <Picker
                          placeholder="AM/PM"
                          placeholderStyle={{color:"#000000"}}
                          mode="dropdown"
                          selectedValue={this.state.show_start_time_AM_PM}
                          onValueChange={x => this.setState({show_start_time_AM_PM:x})}
                        >
                          <Picker.Item label="AM" value="AM" />
                          <Picker.Item label="PM" value="PM" />
                          
                        </Picker>
                      </View>
                      {/* <Input  onChangeText={(show_start_time) => this.setState({show_start_time})} placeholder="Starting time 00:00" value={this.state.show_start_time}/>
                      {timeRegex.test(this.state.show_start_time) ? <Icon name='checkmark-circle' /> : <Icon name='close-circle' />}
                      <Input  onChangeText={(show_start_time_AM_PM) => this.setState({show_start_time_AM_PM})} placeholder="AM/PM" value={this.state.show_start_time_AM_PM}/>
                      {AMPMRegex.test(this.state.show_start_time_AM_PM) ? <Icon name='checkmark-circle' /> : <Icon name='close-circle' />} */}
                    </View>
                  </Item>
                  <Item>

                    <View style={{width: "100%",flexDirection:"row"}}>
                      <View style={{width:"35%"}}>
                        <Picker
                          placeholder="End Hour"
                          mode="dropdown"
                          placeholderStyle={{color:"#000000"}}
                          selectedValue={this.state.show_end_time}
                          onValueChange={x => this.setState({show_end_time:x})}
                        >
                          {this.hourPickerOptions()}
                          
                        </Picker>
                      </View>
                      <View style={{width:"35%"}}>
                        <Picker
                          placeholder="End Minutes"
                          placeholderStyle={{color:"#000000"}}
                          mode="dropdown"
                          selectedValue={this.state.show_end_time_minutes}
                          onValueChange={x => this.setState({show_end_time_minutes:x})}
                        >
                          {this.timePickerOptions()}
                          
                        </Picker>
                      </View>
                      <View style={{width:"30%"}}>
                        <Picker
                          placeholder="AM/PM"
                          placeholderStyle={{color:"#000000"}}
                          mode="dropdown"
                          selectedValue={this.state.show_end_time_AM_PM}
                          onValueChange={x => this.setState({show_end_time_AM_PM:x})}
                        >
                          <Picker.Item label="AM" value="AM" />
                          <Picker.Item label="PM" value="PM" />
                          
                        </Picker>
                      </View>
                      {/* <Input  onChangeText={(show_start_time) => this.setState({show_start_time})} placeholder="Starting time 00:00" value={this.state.show_start_time}/>
                      {timeRegex.test(this.state.show_start_time) ? <Icon name='checkmark-circle' /> : <Icon name='close-circle' />}
                      <Input  onChangeText={(show_start_time_AM_PM) => this.setState({show_start_time_AM_PM})} placeholder="AM/PM" value={this.state.show_start_time_AM_PM}/>
                      {AMPMRegex.test(this.state.show_start_time_AM_PM) ? <Icon name='checkmark-circle' /> : <Icon name='close-circle' />} */}
                    </View>
                  </Item>
                  {/* <Item>
                    <Input  onChangeText={(show_end_time) => this.setState({show_end_time})} placeholder="Ending time 00:00" value={this.state.show_end_time}/>
                    {timeRegex.test(this.state.show_end_time) ? <Icon name='checkmark-circle' /> : <Icon name='close-circle' />}
                    <Input  onChangeText={(show_end_time_AM_PM) => this.setState({show_end_time_AM_PM})} placeholder="AM/PM" value={this.state.show_end_time_AM_PM}/>
                    {AMPMRegex.test(this.state.show_end_time_AM_PM) ? <Icon name='checkmark-circle' /> : <Icon name='close-circle' />}
                  </Item> */}
                  <Item>
                    <Input  onChangeText={(description) => this.setState({description})} placeholder="Description" value={this.state.description}/>
                  </Item>
                  <Item>
                    <Input  onChangeText={(ticket_information) => this.setState({ticket_information})} placeholder="Ticket Information" value={this.state.ticket_information}/>
                  </Item>
                  <Item>
                    <Button dark onPress = {this._pickImage} >
                      <Text>Add A Picture</Text>
                      {this.state.show_picture? <Icon name='checkmark-circle' /> : <Icon name='close-circle' />}
                    </Button>
                    <Button disabled={this.state.pending} dark onPress = {()=> this.PostShow()}>
                      <Text>Post Your Show!</Text>
                    </Button>
                  </Item>
                  {this.state.loadingSpinner}
                  <H1>{this.state.postShowMessage}</H1>
                </View>

              </View>
                        
            </KeyboardAwareScrollView>
          </Container>
        </Root>
      );
    }
    componentDidMount() {
      this.getPermissionAsync();
    }
    hourPickerOptions(){
      var x = [];
      for(var i = 1; i<=12;i++){
        x.push(<Picker.Item key={i} label={i.toString()} value={i.toString()} />)
      }
      return x;
    }
    timePickerOptions(){
      var x = [];
      for(var i = 0; i < 60; i++){
        x.push(<Picker.Item key={i} label={i.toString()} value={i.toString()} />)
      }
      return x;
    }
    yearPickerOptions(){
      var x = [];
      for(var i = 2020; i < 2030; i++){
        x.push(<Picker.Item key={i} label={i.toString()} value={i.toString()} />)
      }
      return x;
    }
    dayPickerOptions(){
      var x = [];
      for(var i = 1; i <= 31; i++){
        x.push(<Picker.Item key={i} label={i.toString()} value={i.toString()} />)
      }
      return x;
    }
    getPermissionAsync = async () => {
      if (Constants.platform.ios) {
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
      }
    }
    _pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.cancelled) {
        this.setState({ show_picture: result.uri });
      }
    };
    PostShow = async () => {
      if(this.validate() == false)
      {
        Toast.show({
          text: 'Form Not filled out properly',
          buttonText: 'Okay',
          duration: 3000,
          position:'top',
          type: "warning"
        });
        return;
      }
      this.setState({loadingSpinner:<Spinner color='#000000' />});
      this.setState({pending:true});
      const fileInfo = await FileSystem.getInfoAsync(this.state.show_picture);
      if (fileInfo.exists) {
        let fileString = await FileSystem.readAsStringAsync(this.state.show_picture, { encoding: FileSystem.EncodingType.Base64  });
        let options = {
          headers: {
            'Content-Type': "application/json",
          }
        }
        var showObj = {
          show_picture: fileString,
          start_time: this.state.month + "/" + this.state.day + "/" + this.state.year + " " + this.state.show_start_time + ":" + this.state.show_start_time_minutes + " " + this.state.show_start_time_AM_PM,
          end_time: this.state.month + "/" + this.state.day + "/" + this.state.year + " " + this.state.show_end_time + ":" + this.state.show_end_time_minutes + " " + this.state.show_end_time_AM_PM,
          street_address: this.state.street_address,
          city: this.state.city,
          state: this.state.state,
          performer_name: this.state.performer_name,
          venue_name: this.state.venue_name,
          description: this.state.description,
          ticket_information: this.state.ticket_information,
          title: this.state.title,
        }
        let JsonString = JSON.stringify(showObj)
        console.log(JsonString)
        Axios.post(config.url + '/api/Show/Create' + "?session_id=" + global.session_id, JsonString, options)
        .then(obj => {
          if(obj.data.isSuccess)
          {
            Toast.show({
              text: 'Succesfully posted show!',
              buttonText: 'Okay',
              duration: 3000,
              position:'top',
              type: "success"
            });
            this.clearInputs();
            this.setState({pending:false});
            this.setState({loadingSpinner:null});
          }else{
            Toast.show({
              text: 'Failed to post show!',
              buttonText: 'Okay',
              duration: 3000,
              position:'top',
              type: "danger"
            });
          }
        })
        .catch(ex => console.log(ex));
      }
      else
      {
        this.setState({postShowMessage:'Add a photo'});
        this.setState({pending:false});
      }
      this.setState({pending:false});
    }
    clearInputs = () => {
      this.setState({venue_name:''});
      this.setState({title:''});
      this.setState({performer_name:''});
      this.setState({street_address:''});
      this.setState({city:''});
      this.setState({state:''});
      this.setState({year:''});
      this.setState({month:''});
      this.setState({day:''});
      this.setState({show_start_time:''});
      this.setState({show_start_time_AM_PM:''});
      this.setState({show_end_time:''});
      this.setState({show_end_time_AM_PM:''});
      this.setState({description:''});
      this.setState({ticket_information:''});
      this.setState({show_picture:null});
    }
    validate = () => {

    }
} 