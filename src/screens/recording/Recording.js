import { View, Text } from "react-native";
import { ScreenBase } from "../common/ScreenBase";

import { styles } from '../../../AppStyles';


export default function Recording({ navigation }) {
  return (
    <View style={styles.view}>
      <ScreenBase props={navigation}/>
      <Text>Recording Screen</Text>
    </View> 
  )
}