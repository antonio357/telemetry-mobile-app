import { View, Text, Button } from "react-native";
import { ScreenBase } from "../common/ScreenBase";
import { observer, inject } from 'mobx-react';
import { styles } from '../../../App.styles';


function Sensores({ navigation, RegisteredSniffersStore }) {
  // console.log(`RegisteredSniffersStore = ${JSON.stringify(RegisteredSniffersStore)}`);
  const { presentLogs, getLogsInTime } = RegisteredSniffersStore;

  return (
    <View style={styles.view}>
      <Button title="get logs" onPress={() => getLogsInTime(5)}/>
      <Text>logs = {presentLogs.length}</Text>
      <ScreenBase openRoutesMenu={() => navigation.openDrawer()} />
    </View>
  );
}

export default inject('RegisteredSniffersStore')(observer(Sensores));
