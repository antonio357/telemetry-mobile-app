import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

function getWsStatus(wsConnectionStatesNum) {
  const wsConnectionStates = {
    0: 'CONNECTING',
    1: 'OPEN',
    2: 'CLOSING',
    3: 'CLOSED', 
  }

  return wsConnectionStates[wsConnectionStatesNum]
}



export default function App() {
  const ws = new WebSocket('ws://192.168.1.199:81');
  
  ws.onopen = () => {
    // connection opened
    // ws.send('something'); // send a message
    console.log('websocket client connected to server', getWsStatus(ws.readyState));
  };
  
  ws.onmessage = (e) => {
    // a message was received
    console.log(e.data, getWsStatus(ws.readyState));
  };
  
  ws.onerror = (e) => {
    // an error occurred
    console.log(e.message, getWsStatus(ws.readyState));
  };
  
  ws.onclose = (e) => {
    // connection closed
    console.log(e.code, e.reason, getWsStatus(ws.readyState));
  };

  useEffect(obj => {
    console.log(`ws.url changed with obj = ${obj} and url = ${ws.url}`);
  }, [ws.url])

  useEffect(obj => {
    console.log(`ws.readyState changed with obj = ${obj} and readyState = ${getWsStatus(ws.readyState)}`);
  }, [ws.readyState])

  return (
    <View style={styles.container}>
      <Text>{getWsStatus(ws.readyState)}</Text>
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
