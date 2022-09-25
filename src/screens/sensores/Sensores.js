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
      <Button title="get logs" onPress={() => getLogsInTime(10)} />
      <Text>logs = {presentLogs.length}</Text>

      <ScreenBase openRoutesMenu={() => navigation.openDrawer()} />
      <View>
        <VictoryChart
          theme={VictoryTheme.material}
        >
          <VictoryLine
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc" }
            }}
            data={presentLogs}
            x={item => item.x}
            y={item => item.y}
            animate={false}
          />
        </VictoryChart>
      </View>
    </View>
  );
}

export default inject('RegisteredSniffersStore')(observer(Sensores));
