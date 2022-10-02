import { View, Text, Button, ScrollView } from "react-native";
import { ScreenBase } from "../common/ScreenBase";
import { observer, inject } from 'mobx-react';
import { styles } from '../../../App.styles';
import { VictoryLine, VictoryTheme, VictoryChart } from 'victory-native';


function Chart({ url, port, data }) {
  return (
    <View>
      <Text>sniffer = {url}, port = {port}</Text>
      <VictoryChart
        theme={VictoryTheme.material}
      >
        <VictoryLine
          style={{
            data: { stroke: "#c43a31" },
            parent: { border: "1px solid #ccc" }
          }}
          data={data}
          x={item => item.x}
          y={item => item.y}
          animate={false}
        />
      </VictoryChart>
    </View>
  );
}

function Sensores({ navigation, RegisteredSniffersStore }) {
  const { presentLogs, getLogsInTime } = RegisteredSniffersStore;

  const definition1 = { url: "url", port: "port", data: [{ "y": 39, "x": 1 }, { "y": 65, "x": 3 }] };
  let chartsArray = [];
  {Object.keys(presentLogs).map(url => {
    Object.keys(presentLogs[url]).map(port => {
      const definition = { url: url, port: port, data: presentLogs[url][port] };
      chartsArray.push(<Chart {...definition} />);
    })
  })}

  return (
    <View style={styles.view}>
      <Button title="get logs" onPress={() => getLogsInTime(10)} />

      <ScrollView>
        {chartsArray.map(item => item)}
      </ScrollView>
      <ScreenBase openRoutesMenu={() => navigation.openDrawer()} />
    </View>
  );
}

export default inject('RegisteredSniffersStore')(observer(Sensores));
