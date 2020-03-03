import {
  createAppContainer,
  SafeAreaView,
  createSwitchNavigator,
} from 'react-navigation';
import {createDrawerNavigator,DrawerItems} from 'react-navigation-drawer';
import FeedScreen from './FeedScreen';
import ShowFeedScreen from './ShowFeedScreen';
import NoLoginAccountScreen from './NoLoginAcountScreen';

const navigator = createDrawerNavigator(
  {
    Shows: {screen: ShowFeedScreen},
    Artists: {screen: FeedScreen},
    Profile : {screen:NoLoginAccountScreen}
  },
  {
    drawerType: 'back',
    drawerLockMode:{}
  }
);
export default createAppContainer(navigator);
