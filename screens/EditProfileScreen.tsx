import { useState, useEffect } from "react";
import { Image, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import Colors from "../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

const defaultAvatar = require("../assets/images/default-profile.png");

export default function EditProfileScreen({ navigation }: any) {
    const { user, updateMe } = useAuth();
    const [username, setUsername] = useState(user?.username ?? "");

    const handleSave = async () => {
        if (!username.trim()) return;

        await updateMe({ username });
        navigation.goBack();
    };

    useEffect(() => {
        if (user?.username) {
            setUsername(user.username);
        }
    }, [user]);

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

            <SafeAreaView edges={["top"]} style={styles.safeArea}>
                <View style={styles.topBar}>
                    <Pressable onPress={() => navigation.goBack()}>
                        <Text style={styles.cancel}>Cancel</Text>
                    </Pressable>

                    <Text style={styles.title}>Edit profile</Text>

                    <Pressable onPress={handleSave}>
                        <Text style={styles.save}>Save</Text>
                    </Pressable>
                </View>
            </SafeAreaView>

            <View style={styles.avatarSection}>
                <Pressable style={styles.avatarWrapper}>
                    <Image source={defaultAvatar} style={styles.avatar} />
                    <View style={styles.cameraOverlay}>
                        <Text style={styles.cameraIcon}>📷</Text>
                    </View>
                </Pressable>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor={Colors.dirtyWhite}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.primary,
    },
    safeArea: {
        backgroundColor: Colors.primary,
    },
    topBar: {
        height: 56,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#222",
    },
    cancel: {
        color: Colors.blue100,
        fontSize: 16,
    },
    title: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    save: {
        color: Colors.blue100,
        fontSize: 16,
        fontWeight: "600",
    },
    avatarSection: {
        alignItems: "center",
        marginTop: 24,
    },
    avatarWrapper: {
        position: "relative",
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
    },
    cameraOverlay: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: Colors.blue100,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    cameraIcon: {
        color: "white",
        fontSize: 14,
    },
    form: {
        paddingHorizontal: 16,
        marginTop: 32,
    },
    label: {
        color: Colors.dirtyWhite,
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: "#333",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: "white",
        fontSize: 16,
    },
});