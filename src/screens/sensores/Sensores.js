import { View, Text, Button } from "react-native";
import { ScreenBase } from "../common/ScreenBase";
import { observer, inject } from 'mobx-react';
import { styles } from '../../../App.styles';
import { VictoryLine, VictoryTheme, VictoryChart } from 'victory-native';


function Sensores({ navigation, RegisteredSniffersStore }) {
  // console.log(`RegisteredSniffersStore = ${JSON.stringify(RegisteredSniffersStore)}`);
  const { presentLogs, getLogsInTime } = RegisteredSniffersStore;
  let counter = -1;

  return (
    <View style={styles.view}>
      <Button title="get logs" onPress={() => getLogsInTime(5)} />
      <Text>logs = {presentLogs.length}</Text>

      <VictoryChart
        theme={VictoryTheme.material}
      >
        <VictoryLine
          style={{
            data: { stroke: "#c43a31" },
            parent: { border: "1px solid #ccc" }
          }}
          // { x: 1, y: 2 }
          data={presentLogs.map(item => {
            counter += 1;
            return { x: counter, y: item };
          })}
        />
      </VictoryChart>
      <ScreenBase openRoutesMenu={() => navigation.openDrawer()} />
    </View>
  );
}

export default inject('RegisteredSniffersStore')(observer(Sensores));
