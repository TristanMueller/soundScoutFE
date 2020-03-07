import {
  createAppContainer,
  SafeAreaView,
  createSwitchNavigator,
} from 'react-navigation';
import {createDrawerNavigator,DrawerItems} from 'react-navigation-drawer';
import FeedScreen from './FeedScreen';
import ShowFeedScreen from './ShowFeedScreen';
import NoLoginAccountScreen from './NoLoginAcountScreen';
import InfoScreen from './InfoScreen';

const navigator = createDrawerNavigator(
  {
    Shows: {screen: ShowFeedScreen},
    Artists: {screen: FeedScreen},
    Profile : {screen:NoLoginAccountScreen},
    Info : {screen:InfoScreen}
  },
  {
    drawerType: 'back',
    drawerLockMode:{}
  }
);
export default createAppContainer(navigator);
