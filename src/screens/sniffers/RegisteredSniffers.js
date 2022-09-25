import { Text, View } from "react-native";
import { ScreenBase } from "../common/ScreenBase";
import RegisteredSniffer from '../../components/sniffer/RegisteredSniffer';
import { observer, inject } from 'mobx-react';
import { styles } from './RegisteredSniffers.styles';


function RegisteredSniffers({ navigation, RegisteredSniffersStore }) {
  const { registeredSniffers, register, connect, disconnect } = RegisteredSniffersStore;

  return (
    <View style={styles.view}>
      {registeredSniffers.map(sniffer => {
        const item = {...sniffer, connect: () => connect(sniffer.url), disconnect: () => disconnect(sniffer.url)};
        return <RegisteredSniffer key={item.url} {...item} />;
      })}
      <ScreenBase openRoutesMenu={() => {
        navigation.openDrawer();
        register();
      }} />
    </View>
  );
}

export default inject('RegisteredSniffersStore')(observer(RegisteredSniffers));
