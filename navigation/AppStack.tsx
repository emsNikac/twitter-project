import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FeedScreen from '../screens/FeedScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import ViewUserScreen from '../screens/ViewUserScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

export type AppStackParamList = {
  Feed: undefined;
  CreatePost: undefined;
  ViewUser: { userId: string };
  EditProfile: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator id="AppStack" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Feed"
        component={FeedScreen}
        options={{ title: 'Feed', contentStyle: { backgroundColor: 'black' } }}
      />

      <Stack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{ presentation: 'modal', headerShown: false, }}
      />

      <Stack.Screen
        name="ViewUser"
        component={ViewUserScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
      />

    </Stack.Navigator>
  );
}