import { SafeAreaView, FlatList } from "react-native";
import { ScreenBase } from "../common/ScreenBase";
import RegisteredSniffer from '../../components/sniffer/RegisteredSniffer';
import { observer, inject } from 'mobx-react';
import { styles } from './RegisteredSniffers.styles';


function RegisteredSniffers({ navigation, RegisteredSniffersStore }) {
  const { registeredSniffers } = RegisteredSniffersStore;

  return (
    <SafeAreaView style={styles.view}>
      <FlatList
        data={registeredSniffers}
        renderItem={({ item }) => <RegisteredSniffer {...item} />}
        keyExtractor={item => item.url}
      />
      <ScreenBase openRoutesMenu={() => {
        navigation.openDrawer();
        RegisteredSniffersStore.register();
      }} />
    </SafeAreaView>
  );
}

export default inject('RegisteredSniffersStore')(observer(RegisteredSniffers));
