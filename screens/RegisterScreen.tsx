import { JSX, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Alert, View, Text, TextInput, Button, ActivityIndicator } from "react-native";

export default function RegisterScreen(): JSX.Element {
    const { register } = useAuth();

    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleRegister = async () => {
        if (!username || !email || !password) {
            Alert.alert('Error', 'All fields are required!');
            return;
        }

        try {
            setLoading(true);
            await register(username, email, password);
        } catch (error) {
            Alert.alert('Registration failed!', 'Username or email may already exist!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            <Text>Create your account</Text>

            <View>
                <Text>Username</Text>
                <TextInput
                    placeholder="Enter username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
            </View>

            <View>
                <Text>Email</Text>
                <TextInput
                    placeholder="Enter email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
            </View>

            <View>
                <Text>Password</Text>
                <TextInput
                    placeholder="Enter password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            {loading ? (
                <ActivityIndicator />
            ) : (
                <Button title="Register" onPress={handleRegister} />
            )}
        </View>
    );
}