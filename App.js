import React from 'react';
import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { styles } from './AppStyles'


export default function App() {
  return (
    <View style={styles.view}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}
