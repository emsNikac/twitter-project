import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Alert, View, Text, TextInput, ActivityIndicator, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/AuthStack";
import Colors from "../constants/colors";

type Props =  NativeStackScreenProps<AuthStackParamList, 'Register'>

export default function RegisterScreen({ navigation }: Props) {
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
        <LinearGradient
            colors={[Colors.primary, Colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.loginContainer}
        >
            <View style={styles.form}>
                <Text style={styles.title}>Create your account</Text>

                <View style={styles.field}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter username"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.field}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.field}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>
                <View style={styles.buttonsColumn}>
                    {loading ? (
                        <ActivityIndicator />
                    ) : (
                        <Pressable style={styles.primaryButton} onPress={handleRegister}>
                            <Text style={styles.primaryButtonText}>Register</Text>
                        </Pressable>
                    )}
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
        color: Colors.blue100,
    },
    field: {
        marginBottom: 12,
    },
    buttonsColumn: {
        marginTop: 24,
    },
    primaryButton: {
        backgroundColor: Colors.blue100,
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
    input: {
        borderWidth: 1,
        borderColor: Colors.gray,
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        marginBottom: 12,
        backgroundColor: 'white',
    },
});
