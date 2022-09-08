import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

// websocket
// turtorials at
// https://www.youtube.com/watch?v=cfggyE1Ptbc&ab_channel=ReactNativeTutorial
// https://www.youtube.com/watch?v=PyNdOCt6i6Q&t=721s&ab_channel=CollabCoding
// window.navigator.userAgent = 'react-native'; // it may need to prevent bugs
import io from 'socket.io-client';

// websocket connecting
const ws = io("ws://192.168.1.199:81", { 
  transports: ["websocket"], // ensure it will use websocke instead of polling which is for http and its slower
  multiplex: true, // avoid createing new connection if not necessary
});

// websocket variables to show status
const showEvents = true
const wsEvents = [
  "error",
  "reconnect",
  "reconnect_attempt",
  "reconnect_error",
  "reconnect_failed",
  "ping",
  "hey",
  "connect",
  "connection",
  "disconnect",
  "upgrade",
  "packet",
  "packetCreate",
  "drain",
  "close",
  "data",
  "connect_error",
]

export default function App() {
  // websocket variables to show status
  const [counter, setCounter] = useState(1);
  const [conncetionStatus, setConnectionStatus] = useState({});

  // using websocket variables to show status
  if (showEvents) {
    wsEvents.map(event => {
      ws.on(event, eventObj => {
        if (counter <= 0) return false
        setCounter(counter - 1)
        let status = conncetionStatus
        if (status[event]) status[event].push(eventObj)
        else status[event] = [eventObj]
        setConnectionStatus({...status})
      })
    })
  } else {
    wsEvents.map(event => {
      ws.on(event, () => {
        if (counter <= 0) return false 
        setCounter(counter - 1)
        let status = conncetionStatus
        if (status[event]) status[event] = status[event] + 1
        else status[event] = 1
        setConnectionStatus({...status})
      })
    })
  }

  return (
    <View style={styles.container}>
      <Text>Connection status: {`${JSON.stringify(conncetionStatus)}`}</Text>
      <Text>Connection props: {Object.keys(ws).map(item => ` ${item} `)}</Text>
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
