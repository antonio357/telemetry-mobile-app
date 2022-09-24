import { Text, View } from "react-native";
import { ScreenBase } from "../common/ScreenBase";
import RegisteredSniffer from '../../components/sniffer/RegisteredSniffer';
import { observer, inject } from 'mobx-react';
import { styles } from './RegisteredSniffers.styles';


function RegisteredSniffers({ navigation, RegisteredSniffersStore }) {
  const { registeredSniffers, register, getWsClient } = RegisteredSniffersStore;

  return (
    <View style={styles.view}>
      {registeredSniffers.map(sniffer => {
        const wsClient = getWsClient(sniffer.url);
        console.log(`wsClient = ${Object.keys(wsClient)}, values = ${Object.values(wsClient)}`);
        console.log(`sniffer = ${Object.keys(sniffer)}, values = ${Object.values(sniffer)}`);
        const item = {...sniffer, ...wsClient};
        return <RegisteredSniffer {...item} />;
      })}
      <ScreenBase openRoutesMenu={() => {
        navigation.openDrawer();
        register();
      }} />
    </View>
  );
}

export default inject('RegisteredSniffersStore')(observer(RegisteredSniffers));
