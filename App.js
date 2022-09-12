import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// repo da lib https://github.com/nathanboktae/robust-websocket

var ws = new RobustWebSocket('ws://echo.websocket.org/', {
   // The number of milliseconds to wait before a connection is considered to have timed out. Defaults to 4 seconds.
   timeout: 4000,
  // A function that given a CloseEvent or an online event (https://developer.mozilla.org/en-US/docs/Online_and_offline_events) and the `RobustWebSocket`,
  // will return the number of milliseconds to wait to reconnect, or a non-Number to not reconnect.
  // see below for more examples; below is the default functionality.
  shouldReconnect: function(event, ws) {
    if (event.code === 1008 || event.code === 1011) return
    return [0, 3000, 10000][ws.attempts]
  },
  // A boolean indicating whether or not to open the connection automatically. Defaults to true, matching native [WebSocket] behavior.
  // You can open the websocket by calling `open()` when you are ready. You can close and re-open the RobustWebSocket instance as much as you wish.
  automaticOpen: true,
  // A boolean indicating whether to disable subscribing to the connectivity events provided by the browser.
  // By default RobustWebSocket instances use connectivity events to avoid triggering reconnection when the browser is offline. This flag is provided in the unlikely event of cases where this may not be desired.
  ignoreConnectivityEvents: false
})

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
