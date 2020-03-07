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
import ChatScreen from './ChatScreen';
import InfoScreen from './InfoScreen';

const navigator = createDrawerNavigator(
  {
    Shows: {screen: ShowFeedScreen},
    Artists: {screen: FeedScreen},
    Profile : {screen:AccountScreen},
    PostAShow: {screen: PostAShowScreen},
    ManageYourShows : {screen: ManageShowsScreen},
    Chat : {screen: ChatScreen},
    Info : {screen: InfoScreen}
  },
  {
    drawerType: 'back',
    drawerLockMode:{}
  }
);

export default createAppContainer(navigator);
