import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../navigation/AppStack";
import { useAuth } from "../context/AuthContext";
import { useTweets } from "../context/TweetsContext";
import React, { useMemo, useState } from "react";
import { FlatList, Image, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import Colors from "../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import TweetCard from "../components/TweetCard";
import { getUserProfileRequest, PublicProfile, toggleFollowRequest } from "../api/users.api";
import { useFocusEffect } from "@react-navigation/native";

type Props = NativeStackScreenProps<AppStackParamList, 'ViewUser'>;
const defaultAvatar = require("../assets/images/default-profile.png");

export default function ViewUserScreen({ route, navigation }: Props) {
    const { userId: authUserId } = useAuth();
    const { tweets } = useTweets();

    const [profile, setProfile] = useState<PublicProfile | null>(null);

    const viewedUserId = route.params.userId;
    const isMe = viewedUserId === authUserId;

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                const result = await getUserProfileRequest(viewedUserId);
                setProfile(result.data);
            })();
        }, [viewedUserId])
    );

    const userTweets = useMemo(() => {
        return tweets.filter((tweet) => tweet.creator?.id === viewedUserId);
    }, [tweets, viewedUserId]);

    if (!profile) return null;

    const handleToggleFollow = async () => {
        const result = await toggleFollowRequest(viewedUserId);
        setProfile(result.data);
    };

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
            <SafeAreaView edges={["top"]} style={styles.safeArea}>
                <View style={styles.topBar}>
                    <Pressable onPress={() => navigation.goBack()}>
                        <Text style={styles.back}>←</Text>
                    </Pressable>
                    <Text style={styles.title}>Profile</Text>

                    <View style={{ width: 24 }} />
                </View>
            </SafeAreaView>

            <View style={styles.profileHeader}>
                <Image
                    source={profile?.picture ? { uri: profile.picture } : defaultAvatar}
                    style={styles.avatar}
                />

                <View style={styles.rightCol}>
                    {isMe ? (
                        <Pressable
                            style={styles.actionBtn}
                            onPress={() => navigation.navigate("EditProfile")}
                        >
                            <Text style={styles.actionText}>Edit profile</Text>
                        </Pressable>
                    ) : (
                        <Pressable
                            style={styles.actionBtn}
                            onPress={handleToggleFollow}
                        >
                            <Text style={styles.actionText}>
                                {profile?.isFollowedByMe ? "Unfollow" : "Follow"}
                            </Text>
                        </Pressable>
                    )}
                </View>
            </View>

            <Text style={styles.username}>
                @{profile.username}
            </Text>

            <View style={styles.followRow}>
                <Text style={styles.followText}>
                    <Text style={styles.followBold}>
                        {profile?.followingCount ?? 0}
                    </Text> Following
                </Text>
                <Text style={styles.followText}>
                    <Text style={styles.followBold}>
                        {profile?.followersCount ?? 0}
                    </Text> Followers
                </Text>
            </View>

            <View style={styles.tabRow}>
                <Text style={styles.tabActive}>Tweets</Text>
            </View>

            <FlatList
                data={userTweets}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <TweetCard tweet={item} />}
                contentContainerStyle={{ paddingBottom: 60 }}
            />
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
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#222",
    },
    back: {
        color: "white",
        fontSize: 22,
        width: 24
    },
    title: {
        flex: 1,
        color: "white",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
    profileHeader: {
        flexDirection: "row",
        paddingHorizontal: 14,
        paddingTop: 14,
        alignItems: "center",
        justifyContent: "space-between",
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    rightCol: {
        alignItems: "flex-end"
    },
    actionBtn: {
        borderWidth: 1,
        borderColor: Colors.blue100,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
    },
    actionText: {
        color: Colors.blue100, fontWeight: "600"
    },
    username: {
        color: "white",
        fontSize: 18,
        fontWeight: "700",
        paddingHorizontal: 14,
        paddingTop: 10
    },
    followRow: {
        flexDirection: "row",
        gap: 16,
        paddingHorizontal: 14,
        paddingTop: 8,
        paddingBottom: 10
    },
    followText: {
        color: Colors.dirtyWhite,
    },
    followBold: {
        color: "white",
        fontWeight: "700"
    },
    tabRow: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#222",
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    tabActive: {
        color: Colors.blue100,
        fontWeight: "700"
    },
});