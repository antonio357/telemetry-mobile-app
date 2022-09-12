import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function getWsStatus(code) {
  const wsConnectionStates = {
    0: 'CONNECTING',
    1: 'OPEN',
    2: 'CLOSING',
    3: 'CLOSED',
  }

  return wsConnectionStates[code]
}

let ws = new WebSocket('ws://192.168.1.199:81')
let autoReconnect = true
let wsReceivingLogs = false
let waitingPong = false

ws.onopen = obj => console.log(`WS = ${ws.url} onopen: \nwebsocket client connected to websocket server ${ws.url}`)
ws.onclose = close => console.log(`WS = ${ws.url} onclose: \nclose.code = ${close.code}, close.reason = ${close.reason}`)
ws.onerror = error => console.log(`WS = ${ws.url} onerror: \nerror.message = ${error.message}`)
ws.onmessage = message => {
  console.log(`WS = ${ws.url} onmessage: \nmessage.data = ${message.data}`)
  if (message.data == "pong") waitingPong = false
}

setInterval(() => {
  // this is necessary cause of WARNNING_1
  if (waitingPong) ws.close(ws.CLOSED, "oncheckalive periodically ping timeout")
  // if ws connection is off ws.send("ping") will generate an onerror event that closes the connection and updates ws.readyState to ws.CLOSED, WARNNING_1 this only works if esp is connected to energy.
  if (!wsReceivingLogs) {
    ws.send("ping")
    waitingPong = true
  } 
  else waitingPong = false
  if (ws.readyState == ws.CLOSED || ws.readyState == ws.CLOSING && autoReconnect) ws = new WebSocket(ws.url)
  console.log(`WS = ${ws.url} oncheckalive: \nreadyState = ${getWsStatus(ws.readyState)}`)
}, 5000);

export default function App() {

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
