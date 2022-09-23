import React from 'react';
import { SafeAreaView, View, FlatList, Text, Button } from "react-native";
import { ScreenBase } from "../common/ScreenBase";
import { observer, inject } from 'mobx-react';
import { styles } from './Sniffers.styles';
import { RegisteredSniffer } from '../../components/sniffer/Sniffer';


function Sniffers({ navigation, SniffersStore }) {
  const registeredSniffers = SniffersStore.registeredSniffers;
  const wsClients = SniffersStore.wsClients;

  return (
    <SafeAreaView style={styles.view}>
      <FlatList
        data={registeredSniffers}
        // this function needs to destruct item, so do not rename it
        renderItem={({ item }) => {
          console.log(`wsClients = ${wsClients[0].connect || 'não tem wsClients'}`);
          return <RegisteredSniffer {...item} connect={wsClients[0].connect} disconnect={wsClients[0].disconnect}/>
        }}
        keyExtractor={item => item.id}
      />
      <ScreenBase openRoutesMenu={() => navigation.openDrawer()} />
    </SafeAreaView>
  );
}

export default inject('SniffersStore')(observer(Sniffers));
