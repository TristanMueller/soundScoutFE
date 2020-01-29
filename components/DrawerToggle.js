import React from 'react';
import {  View, Text,Image } from 'react-native';
import {Button} from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { withNavigation } from 'react-navigation';


class DrawerToggle extends React.Component{
    render(){
        return(
        <View>
            <TouchableOpacity
                onPress={() => {
                this.props.navigation.toggleDrawer();
                }}
            >
                <Image
                    source={require('../assets/DrawerToggle.png')}
                />
            </TouchableOpacity>
        </View>
        );
    }
}
export default withNavigation(DrawerToggle);