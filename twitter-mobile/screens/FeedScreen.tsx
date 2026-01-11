import React, { useCallback } from 'react';
import { View, Image, StyleSheet, Pressable, StatusBar, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import XLogo from '../components/icons/XLogo';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/AppStack';
import { FlatList } from 'react-native';
import { useTweets } from '../context/TweetsContext';
import TweetCard from '../components/TweetCard';
import Colors from '../constants/colors';
import { useAuth } from "../context/AuthContext";
import { useFocusEffect } from '@react-navigation/native';

const avatarImg = require('../assets/images/default-profile.png');

type Props = NativeStackScreenProps<AppStackParamList, 'Feed'>;


export default function FeedScreen({ navigation }: Props) {
  const { tweets, loadTweets } = useTweets();
  const { userId, logout } = useAuth();

  useFocusEffect(
    useCallback(() => {
      loadTweets();
    }, [])
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => {
            if (!userId) return;
            navigation.navigate("ViewUser", { userId });
          }} style={styles.avatarBtn}>
            <Image source={avatarImg} style={styles.avatar} />
          </Pressable>

          <View style={styles.logoCenter}>
            <XLogo size={30} color="white" />
          </View>

          <Pressable onPress={logout}>
            <Text style={styles.logout}>Logout</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <FlatList
        data={tweets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => <TweetCard tweet={item} />}
      />

      <Pressable
        onPress={() => navigation.navigate('CreatePost')}
        style={({ pressed }) => [
          styles.fab,
          pressed && styles.fabPressed,
        ]}
        android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: true }}
      >
        <Text style={styles.fabPlus}>＋</Text>
      </Pressable>

    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'black',
    position: 'relative',
  },
  safeArea: {
    backgroundColor: 'black',
  },
  header: {
    height: 56,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#222',
  },
  avatarBtn: {
    width: 55,
    height: 55,
    borderRadius: 18,
    overflow: 'hidden',
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 18,
  },
  logoCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  logout: {
    color: Colors.blue100,
    fontSize: 14,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 18 + 16,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: Colors.blue100,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },

    elevation: 6,
  },
  fabPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  fabPlus: {
    color: 'white',
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '600',
    marginTop: -2,
  },
});