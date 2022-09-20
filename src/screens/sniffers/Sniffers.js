import { View, Text } from "react-native";
import { ScreenBase } from "../common/ScreenBase";
import { Sniffer } from "../../components/sniffer/Sniffer";

import { styles } from '../../../App.styles';


export default function Sniffers({ navigation }) {
  return (
    <View style={styles.view}>
      <ScreenBase openRoutesMenu={() => navigation.openDrawer()}/>
      <Sniffer status={"static status"}/>
    </View>
  )
}