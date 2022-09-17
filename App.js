import { StatusBar } from 'expo-status-bar';
import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import WebSocketClient from './WebSocketClient';

var here = new WebSocketClient({ url: 'ws://192.168.1.199:81' });

export default function App() {

  return (
    <View style={styles.container}>
      <Text>my text</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
