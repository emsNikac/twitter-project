import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AuthProvider } from './context/AuthContext';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';

export default function App() {
  const [showRegister, setShowRegister] = useState(false);


  return (
    <AuthProvider>
      <View style={styles.container}>
        {showRegister ? (
          <RegisterScreen />
        ) : (
          <LoginScreen onCreateAccount={() => setShowRegister(true)} />
        )
        }
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
