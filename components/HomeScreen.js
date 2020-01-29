// Docs: https://reactnavigation.org/docs/en/drawer-navigator.html
// Ionicons: http://ionicons.com
// Brent Vatne: https://twitter.com/notbrent
// Eric Vicenti: https://twitter.com/EricVicenti
// Video Tutorial: https://www.youtube.com/watch?v=ZzhOjO-1dCs

import * as React from 'react';
import { Text, View, Image, ScrollView, StyleSheet } from 'react-native';
import DrawerToggle from '../components/DrawerToggle'
import {
  createAppContainer,
  SafeAreaView,
} from 'react-navigation';
import {createDrawerNavigator,DrawerItems} from 'react-navigation-drawer';
import AccountScreen from './AccountScreen';
import FeedScreen from './FeedScreen';
import PostAShowScreen from './PostAShowScreen';
import ShowFeedScreen from './ShowFeedScreen';
import ManageShowsScreen from './ManageShowsScreen';
import ChatScreen from './ChatScreen'

const navigator = createDrawerNavigator(
  {
    Shows: {screen: ShowFeedScreen},
    Artists: {screen: FeedScreen},
    Profile : {screen:AccountScreen},
    PostAShow: {screen: PostAShowScreen},
    ManageYourShows : {screen: ManageShowsScreen},
    Chat : {screen: ChatScreen},
  },
  {
    drawerType: 'back',
    drawerLockMode:{}
  }
);

export default createAppContainer(navigator);
