import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthStack from './navigation/AuthStack';
import AppStack from './navigation/AppStack';
import { StyleSheet, View } from 'react-native';
import { TweetsProvider } from './context/TweetsContext';

function RootNavigator() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <AppStack /> : <AuthStack />;
}

export default function App() {
  return (
    <AuthProvider>
      <View style={styles.root}>
        <TweetsProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </TweetsProvider>
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'black',
  }
});