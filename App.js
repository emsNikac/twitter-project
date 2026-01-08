import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthStack from './navigation/AuthStack';
import AppStack from './navigation/AppStack';
import { StyleSheet, View } from 'react-native';

function RootNavigator() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <AppStack /> : <AuthStack />;
}

export default function App() {
  return (
    <AuthProvider>
      <View style={styles.root}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0F4C75',
  }
});