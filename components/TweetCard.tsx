import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Tweet, useTweets } from '../context/TweetsContext';
import { timeAgo } from '../utils/timeAgo';
import CommentsIcon from './icons/CommentsIcon';
import LikeIcon from './icons/LikeIcon';
import RetweetIcon from './icons/RetweetIcon';
import Colors from '../constants/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/AppStack';
import { useNavigation } from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export default function TweetCard({ tweet }: { tweet: Tweet }) {
    const { toggleLike, toggleRetweet } = useTweets();
    const navigaton = useNavigation<NavigationProp>();

    const goToProfile = () => {
        if(!tweet.creator?.id) return;
        navigaton.navigate('ViewUser', {userId: tweet.creator.id});
    }

    return (
        <View style={styles.container}>
            <Pressable onPress={goToProfile}>
                <Image
                    source={
                        tweet.creator?.picture
                            ? { uri: tweet.creator.picture }
                            : require('../assets/images/default-profile.png')
                    }
                    style={styles.avatar}
                />
            </Pressable>

            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <Pressable onPress={goToProfile}>
                        <Text style={styles.username}>
                            @{tweet.creator?.username ?? 'unknown'}
                        </Text>
                    </Pressable>
                    <Text style={styles.tweetTime}> · {timeAgo(tweet.createdAt)}</Text>
                </View>

                <Text style={styles.text}>{tweet.content}</Text>

                <View style={styles.actions}>
                    <CommentsIcon size={20} />
                    <Pressable onPress={() => toggleLike(tweet.id)}>
                        <LikeIcon filled={tweet.isLikedByMe}/>
                        <Text style={{ color: Colors.dirtyWhite }}>
                            {tweet.likesCount}
                        </Text>
                    </Pressable>
                    <Pressable onPress={() => toggleRetweet(tweet.id)}>
                        <RetweetIcon filled={tweet.isRetweetedByMe} />
                        <Text>{tweet.retweetsCount}</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#222',
        backgroundColor: 'black',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 10,
    },
    content: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    name: {
        color: 'white',
        fontWeight: '700',
    },
    username: {
        color: Colors.usernameColor,
    },
    tweetTime: {
        color: Colors.usernameColor,
        opacity: 0.9,
    },
    text: {
        color: 'white',
        marginTop: 4,
        lineHeight: 20,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingRight: 30,
    },
});