import React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar } from "react-native";
import { ScreenBase } from "../common/ScreenBase";
import { Sniffer } from "../../components/sniffer/Sniffer";

import { styles } from './Sniffers.styles';


let DATA = [];
for (let index = 0; index < 30; index++) {
  DATA.push({ id: `${index}`, title: `item ${index}` })
}

const Item = ({ title }) => (
  <View>
    <Text>{title}</Text>
  </View>
);

export default function Sniffers({ navigation }) {
  const renderItem = ({ item }) => (
    <Item title={item.title} />
  );

  return (
    <SafeAreaView style={styles.view}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <ScreenBase openRoutesMenu={() => navigation.openDrawer()} />
    </SafeAreaView>
  );
}
