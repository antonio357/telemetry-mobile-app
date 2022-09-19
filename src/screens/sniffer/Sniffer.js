import { View, Text } from "react-native";
import { ScreenBase } from "../common/ScreenBase";

import { styles } from '../../../App.styles';


export default function Sniffer({ navigation }) {
  return (
    <View style={styles.view}>
      <ScreenBase openRoutesMenu={() => navigation.openDrawer()}/>
      <Text>Sniffer Screen</Text>
    </View>
  )
}