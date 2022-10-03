import { Text, View } from "react-native";
import { ScreenBase } from "../common/ScreenBase";
import RegisteredSniffer from '../../components/sniffer/RegisteredSniffer';
import { observer, inject } from 'mobx-react';
import { styles } from './RegisteredSniffers.styles';


function RegisteredSniffers({ navigation, RegisteredSniffersStore }) {
  const { registeredSniffers, connect, disconnect, setSensorType } = RegisteredSniffersStore;

  return (
    <View style={styles.view}>
      {registeredSniffers.map(sniffer => {
        const item = {...sniffer, connect: connect, disconnect: disconnect, setSensorType: setSensorType};
        return <RegisteredSniffer key={item.url} {...item} />;
      })}
      <ScreenBase openRoutesMenu={() => {
        navigation.openDrawer();
      }} />
    </View>
  );
}

export default inject('RegisteredSniffersStore')(observer(RegisteredSniffers));
