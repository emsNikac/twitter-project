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
import { useAuth } from '../context/AuthContext';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

function normalizeTweet(tweet: Tweet): Tweet {
    if (tweet.type !== 'RETWEET' || !tweet.originalTweet) {
        return tweet;
    }

    return {
        id: tweet.originalTweet.id,
        type: 'ORIGINAL',

        content: tweet.originalTweet.content,
        picture: tweet.originalTweet.picture,

        creator: tweet.originalTweet.creator,

        likesCount: tweet.likesCount,
        retweetsCount: tweet.retweetsCount,
        isLikedByMe: tweet.isLikedByMe,
        isRetweetedByMe: tweet.isRetweetedByMe,

        createdAt: tweet.createdAt,
    };
}

export default function TweetCard({ tweet }: { tweet: Tweet }) {
    const { toggleLike, toggleRetweet } = useTweets();
    const navigation = useNavigation<NavigationProp>();
    const { userId } = useAuth();

    const baseTweet = normalizeTweet(tweet);

    const originalId = baseTweet.id;
    const isOwnTweet = baseTweet.creator.id === userId;

    const engagementState =
        tweet.type === 'RETWEET'
            ? {
                likesCount: tweet.likesCount,
                retweetsCount: tweet.retweetsCount,
                isLikedByMe: tweet.isLikedByMe,
                isRetweetedByMe: true,
            }
            : tweet;

    const goToProfile = () => {
        navigation.navigate('ViewUser', { userId: baseTweet.creator.id });
    };

    if (tweet.type === 'RETWEET' && tweet.originalTweet) {
        return (
            <View style={styles.retweetWrapper}>
                <Text style={styles.retweetLabel}>
                    {tweet.creator.username} retweeted
                </Text>

                <TweetCard tweet={baseTweet} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Pressable onPress={goToProfile}>
                <Image
                    source={
                        baseTweet.creator.picture
                            ? { uri: baseTweet.creator.picture }
                            : require('../assets/images/default-profile.png')
                    }
                    style={styles.avatar}
                />
            </Pressable>

            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <Pressable onPress={goToProfile}>
                        <Text style={styles.username}>
                            @{baseTweet.creator.username}
                        </Text>
                    </Pressable>

                    <Text style={styles.tweetTime}>
                        · {timeAgo(baseTweet.createdAt)}
                    </Text>
                </View>

                <Text style={styles.text}>{baseTweet.content}</Text>

                <View style={styles.actions}>
                    <CommentsIcon size={20} />

                    <Pressable onPress={() => toggleLike(originalId)}>
                        <LikeIcon filled={engagementState.isLikedByMe} />
                        <Text style={{ color: Colors.dirtyWhite }}>
                            {engagementState.likesCount}
                        </Text>
                    </Pressable>

                    <Pressable
                        disabled={isOwnTweet}
                        onPress={() => toggleRetweet(originalId)}
                        style={{ opacity: isOwnTweet ? 0.4 : 1 }}
                    >
                        <RetweetIcon filled={engagementState.isRetweetedByMe} />
                        <Text style={{ color: Colors.dirtyWhite }}>
                            {engagementState.retweetsCount}
                        </Text>
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
    retweetWrapper: {
        backgroundColor: 'black',
    },
    retweetLabel: {
        color: Colors.dirtyWhite,
        fontSize: 13,
        marginLeft: 54,
        marginBottom: 4,
        paddingTop: 8,
    },
});