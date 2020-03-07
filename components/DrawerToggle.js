import React from 'react';
import {  View, Text,Image } from 'react-native';
import {Button} from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { withNavigation } from 'react-navigation';
import { AntDesign } from '@expo/vector-icons';


class DrawerToggle extends React.Component{
    render(){
        return(
        <View style={{width:64,height:64}}>
            <TouchableOpacity
                onPress={() => {
                this.props.navigation.toggleDrawer();
                }}
            >
            <AntDesign  name="bars" color="black" size={64}/>
            </TouchableOpacity>
        </View>
        );
    }
}
export default withNavigation(DrawerToggle);