import { View } from "react-native";
import { ScreenBase } from "../common/ScreenBase";
import RegisteredSniffer from '../../components/sniffer/RegisteredSniffer';
import { observer, inject } from 'mobx-react';
import { styles } from './RegisteredSniffers.styles';


function RegisteredSniffers({ navigation, RegisteredSniffersStore }) {
  const { registeredSniffers, register } = RegisteredSniffersStore;

  return (
    <View style={styles.view}>
      {registeredSniffers.map(sniffer => <RegisteredSniffer key={sniffer.url} {...sniffer} />)}
      <ScreenBase openRoutesMenu={() => {
        navigation.openDrawer();
        register();
      }} />
    </View>
  );
}

export default inject('RegisteredSniffersStore')(observer(RegisteredSniffers));
