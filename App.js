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

var ws = new WebSocket('ws://192.168.1.199:81')
var autoReconnect = true
var wsReceivingLogs = false
var waitingPong = false
var waitingClose = false

ws.onopen = obj => console.log(`WS = ${ws.url} onopen: \nwebsocket client connected to websocket server ${ws.url}`)
ws.onclose = close => console.log(`WS = ${ws.url} onclose: \nclose.code = ${close.code}, close.reason = ${close.reason}`)
ws.onerror = error => console.log(`WS = ${ws.url} onerror: \nerror.message = ${error.message}`)
// ws.onmessage = message => {
//   console.log(`WS = ${ws.url} onmessage: \nmessage.data = ${message.data}`)
//   if (message.data == "pong") {
//     waitingPong = false
//     ws.readyState = ws.OPEN
//   }
// }

// setInterval(() => {
//   if (waitingClose && ws.readyState == ws.CLOSED) waitingClose = false 
//   // this is necessary cause of WARNNING_1
//   if (waitingPong) ws.close(ws.CLOSED, "oncheckalive periodically ping timeout")
//   // if ws connection is off ws.send("ping") will generate an onerror event that closes the connection and updates ws.readyState to ws.CLOSED, WARNNING_1 this only works if esp is connected to energy.
//   if (!wsReceivingLogs) {
//     ws.send("ping")
//     waitingPong = true
//   }
//   else waitingPong = false
//   if (ws.readyState == ws.CLOSED || ws.readyState == ws.CLOSING && autoReconnect) {
//     if (ws) {
//       if (!waitingClose) {
//         ws.close("lost")
//         waitingClose = true
//       }
//       if (!waitingClose) ws = new WebSocket(ws.url)
//     }
//   }
//   console.log(`WS = ${ws.url} oncheckalive: \nreadyState = ${getWsStatus(ws.readyState)}`)
//   // setWsState(getWsStatus(ws.readyState))
// }, 3000);

// connection KeepAlive

ws.onmessage = message => {
  // console.log(`WS = ${ws.url} onmessage: \nmessage.data = ${message.data}`)
  if (waitingPong && message.data == "pong") {
    waitingPong = false
    console.log(`received pong`)
    // ws.readyState = ws.OPEN
  }
}

// eventos periódicos do autoReconnect
setInterval(() => {
  console.log(`WS = ${ws.url} readyState = ${getWsStatus(ws.readyState)}`)
  if (autoReconnect) {
    if (ws.readyState == ws.OPEN && !waitingPong) {
      ws.send("ping")
      waitingPong = true
      console.log(`sent ping, waiting pong`)
    }
    else if (waitingPong && !waitingClose) {
      ws.close()
      waitingClose = true
      console.log(`pong timeout, waiting client to close`)
    }
    else if (waitingClose && ws.readyState == ws.CLOSED) {
      waitingClose = false
      waitingPong = false
      const url = ws.url
      // var ws = new WebSocket(url)
      console.log(`creating new client`)
    }
  }
  console.log(`WS = ${ws.url} readyState = ${getWsStatus(ws.readyState)}`)
  // if (!waitingPong) {
  //   ws.send("ping")
  //   waitingPong = true
  // }

  // // client did not closed connection and was expecting a pong but did not get it in time
  // else if (!waitingClose) {
  //   ws.close()
  //   waitingClose = true
  // }

  // // se tava esperando a conexão fechou 
  // if (waitingClose && ws.readyState == ws.CLOSED) {
  //   waitingClose = false
  //   waitingPong = false
  //   ws = new WebSocket(ws.url)
  // }
}, 1000);


export default function App() {
  // const [wsState, setWsState] = useState(getWsStatus(ws.readyState));

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
