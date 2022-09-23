import React from 'react';
import { SafeAreaView, View, FlatList, Text, StatusBar } from "react-native";
import { ScreenBase } from "../common/ScreenBase";
import { observer, inject } from 'mobx-react';
import { styles } from './Sniffers.styles';


const Item = ({ title }) => (
  <View>
    <Text>{title}</Text>
  </View>
);

function Sniffers({ navigation, SniffersStore }) {
  const { registeredSniffers } = SniffersStore;

  for (let index = 0; index < 50; index++) {
    SniffersStore.registerSniffer();
    
  }

  const renderItem = ({ item }) => (
    <Item title={item.title} />
  );

  return (
    <SafeAreaView style={styles.view}>
      <FlatList
        data={registeredSniffers}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <ScreenBase openRoutesMenu={() => navigation.openDrawer()} />
    </SafeAreaView>
  );
}

export default inject('SniffersStore')(observer(Sniffers));
