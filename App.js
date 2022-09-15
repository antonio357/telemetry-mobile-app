import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import WebSocketClient from '@gamestdio/websocket'; 

// fibonacci backoff strategy
var ws = new WebSocketClient('ws://192.168.1.199:81', [], {
  backoff: "fibonacci"
});

ws.reconnectEnabled = true

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
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
