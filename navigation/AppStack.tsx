import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FeedScreen from '../screens/FeedScreen';

export type AppStackParamList = {
  Feed: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator id="AppStack" screenOptions={{ headerShown: false }}>
      <Stack.Screen 
      name="Feed" 
      component={FeedScreen} options={{ title: 'Feed', contentStyle: {backgroundColor: '#000'} }}/>
    </Stack.Navigator>
  );
}