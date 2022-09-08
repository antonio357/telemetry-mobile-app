import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const wsConnectionStates = {
  0: 'CONNECTING',
  1: 'OPEN',
  2: 'CLOSING',
  3: 'CLOSED', 
}
let ws = new WebSocket('ws://192.168.1.199:81');

ws.onopen = () => {
  // connection opened
  // ws.send('something'); // send a message
  console.log('websocket client connected to server', wsConnectionStates[ws.readyState]);
};

ws.onmessage = (e) => {
  // a message was received
  console.log(e.data, wsConnectionStates[ws.readyState]);
};

ws.onerror = (e) => {
  // an error occurred
  console.log(e.message, wsConnectionStates[ws.readyState]);
};

ws.onclose = (e) => {
  // connection closed
  console.log(e.code, e.reason, wsConnectionStates[ws.readyState]);
};


export default function App() {
  return (
    <View style={styles.container}>
      <Text>{wsConnectionStates[ws.readyState]}</Text>
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
