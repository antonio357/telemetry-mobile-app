import { View, Text } from "react-native";
import { ScreenBase } from "../common/ScreenBase";

import { styles } from '../../../App.styles';


export default function Videos({ navigation }) {
  return (
    <View style={styles.view}>
      <ScreenBase openRoutesMenu={() => navigation.openDrawer()}/>
      <Text>Videos Screen</Text>
    </View> 
  )
}