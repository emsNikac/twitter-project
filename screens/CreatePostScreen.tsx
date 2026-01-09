import { useState } from "react";
import { View, StatusBar, StyleSheet, Pressable, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/colors";
import { useTweets } from '../context/TweetsContext';

export default function CreatePostScreen({ navigation }: any) {
    const [content, setContent] = useState('');
    const { createTweet } = useTweets();

    const checkPost = content.trim().length > 0;

    return (
        <View style={styles.root}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.header}>
                    <Pressable onPress={() => navigation.goBack()}>
                        <Text style={styles.cancel}>Cancel</Text>
                    </Pressable>

                    <Pressable
                        disabled={!checkPost}
                        style={[styles.postBtn, !checkPost && styles.postBtnDisabled]}
                        onPress={async () => { await createTweet(content); navigation.goBack(); }} 
                    >
                        <Text style={styles.postText}>Post</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
            <View style={styles.body}>
                <TextInput
                    placeholder="What is happening?"
                    placeholderTextColor="#999"
                    value={content}
                    onChangeText={setContent}
                    multiline
                    autoFocus
                    style={styles.input}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'black',
    },
    safeArea: {
        backgroundColor: 'black',
    },
    header: {
        height: 56,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'white',
    },
    cancel: {
        fontSize: 16,
        color: Colors.blue100,
    },
    postBtn: {
        backgroundColor: Colors.blue100,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 999,
    },
    postBtnDisabled: {
        backgroundColor: Colors.dirtyWhite,
        opacity: 0.5,
    },
    postText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 15,
    },
    body: {
        flex: 1,
        padding: 16,
    },
    input: {
        fontSize: 18,
        lineHeight: 24,
        color: 'white',
    },
});

