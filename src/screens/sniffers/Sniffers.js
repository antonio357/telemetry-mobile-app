import React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar } from "react-native";
import { ScreenBase } from "../common/ScreenBase";
import { Sniffer } from "../../components/sniffer/Sniffer";

import { styles } from '../../../App.styles';


const stylesSniffer = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 20,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

let DATA = [];
for (let index = 0; index < 30; index++) {
  DATA.push({ id: `${index}`, title: `item ${index}` })
}


const Item = ({ title }) => (
  <View style={stylesSniffer.item}>
    <Text style={stylesSniffer.title}>{title}</Text>
  </View>
);

export default function Sniffers({ navigation }) {
  const renderItem = ({ item }) => (
    <Item title={item.title} />
  );

  return (
    <SafeAreaView style={stylesSniffer.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <ScreenBase openRoutesMenu={() => navigation.openDrawer()} />
    </SafeAreaView>
  );
}
