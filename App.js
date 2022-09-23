import React from 'react';
import Stores from './src/stores'
import { Provider } from 'mobx-react';
import 'react-native-gesture-handler';
import { Routes } from './src/routes/Context';


// turtorial https://www.youtube.com/watch?v=pKvA6IQUnaM&t=2s&ab_channel=IagoBranco

export default function App() {
  return (
    <Provider {...Stores}>
      <Routes />
    </Provider>
  );
}
