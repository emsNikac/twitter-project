import { JSX, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Alert, View, Text, TextInput, ActivityIndicator, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";

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
        if (!email || !password) {
            Alert.alert('Error', 'Enter both email and password');
            return;
        }

        try {
            setLoading(true);
            await login(email, password);
        } catch (error) {
            Alert.alert('Login failed!', 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={['#1DA1F2', '#0F4C75']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.loginContainer}
        >
            <View style={styles.form}>
                <Text style={styles.title}>Sign in.</Text>

                <View style={styles.field}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        autoCapitalize="none"
                        onChangeText={setEmail}
                    />
                </View>

                <View style={styles.field}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <View style={styles.buttonsColumn}>
                    {loading ? (
                        <ActivityIndicator />
                    ) : (
                        <Pressable style={styles.primaryButton} onPress={handleLogin}>
                            <Text style={styles.primaryButtonText}>Login</Text>
                        </Pressable>
                    )}

                    <Pressable style={styles.secondaryButton} onPress={onCreateAccount}>
                        <Text style={styles.secondaryButtonText}>Create account</Text>
                    </Pressable>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    form: {
        width: '70%',
    },
    title: {
        alignSelf: 'flex-start',
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 24,
    },
    field: {
        marginBottom: 12,
    },
    buttonsColumn: {
        marginTop: 24,
    },
    primaryButton: {
        backgroundColor: '#1DA1F2',
        paddingVertical: 14,
        borderRadius: 999,
        alignItems: 'center',
        marginBottom: 12,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        borderWidth: 1,
        borderColor: '#1DA1F2',
        paddingVertical: 14,
        borderRadius: 999,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#1DA1F2',
        fontSize: 16,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        marginBottom: 12,
        backgroundColor: '#fff',
    },
});