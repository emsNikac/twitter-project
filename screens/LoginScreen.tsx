import { JSX, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Alert, View, Text, TextInput, Button, ActivityIndicator } from 'react-native';

type LoginScreenProps = {
    onCreateAccount: () => void;
};

export default function LoginScreen({
    onCreateAccount,
}: LoginScreenProps): JSX.Element {
    const { login } = useAuth();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogin = async () => {
        if (!email || !password){
            Alert.alert('Error', 'Enter both email and password');
            return;
        }

        try{
            setLoading(true);
            await login(email, password);
        } catch (error){
            Alert.alert('Login failed!', 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return(
        <View>
            <Text>Sign in.</Text>

            <View>
                <Text>Email</Text>
                <TextInput
                    placeholder="Enter your email"
                    value={email}
                    autoCapitalize="none"
                    onChangeText={setEmail}
                />
            </View>

            <View>
                <Text>Password</Text>
                <TextInput
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            {loading ? (
                <ActivityIndicator />
            ) : (
                <Button title="Login" onPress={handleLogin} />
            )}

            <Button title="Create an account" onPress={onCreateAccount} />
        </View>
    );

}