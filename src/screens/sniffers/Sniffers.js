import React from 'react';
import { SafeAreaView, View, FlatList, Text, Button } from "react-native";
import { ScreenBase } from "../common/ScreenBase";
import { observer, inject } from 'mobx-react';
import { styles } from './Sniffers.styles';
import { RegisteredSniffer } from '../../components/sniffer/Sniffer';


const Item = ({ title }) => (
  <View>
    <Text>{title}</Text>
  </View>
);

function Sniffers({ navigation, SniffersStore }) {
  const registeredSniffers = SniffersStore.registeredSniffers;

  for (let index = 0; index < 2; index++) {
    SniffersStore.registerSniffer({
      id: index,
      name: 'nome do sniffer',
      title: 'título do sniffer',
      url: 'url do websocket server',
      status: 'desconectado',
    });
  }

  return (
    <SafeAreaView style={styles.view}>
      <FlatList
        data={registeredSniffers}
        // this function needs to destruct item, so do not rename it
        renderItem={({ item }) => <RegisteredSniffer {...item} />}
        keyExtractor={item => item.id}
      />
      <ScreenBase openRoutesMenu={() => navigation.openDrawer()} />
    </SafeAreaView>
  );
}

export default inject('SniffersStore')(observer(Sniffers));
