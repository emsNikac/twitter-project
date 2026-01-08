import React from 'react';
import { View, Image, StyleSheet, Pressable, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import XLogo from '../components/XLogo';

const avatarImg = require('../assets/images/default-profile.png');

export default function FeedScreen() {
  return (
    <View>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          
          {/* Left: profile circle */}
          <Pressable onPress={() => { }} style={styles.avatarBtn}>
            <Image source={avatarImg} style={styles.avatar}/>
          </Pressable>

          {/* Center: X logo */}
          <View style={styles.logoCenter}>
            <XLogo size={30} color="#fff" />
          </View>
        </View>
      </SafeAreaView>

      {/* screen body */}
      <View style={styles.body} />
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    backgroundColor: 'black',
  },
  header: {
    height: 56,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#222',
    backgroundColor: 'black',
    position: 'relative',
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
  body: {
    flex: 1,
    backgroundColor: 'black',
  },
});