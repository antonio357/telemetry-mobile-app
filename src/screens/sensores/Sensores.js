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
          data={[]}
          x={item => item.x}
          y={item => item.y}
          animate={false}
        />
      </VictoryChart>
    </View>
  );
}

function Sensores({ navigation, RegisteredSniffersStore }) {
  // // console.log(`RegisteredSniffersStore = ${JSON.stringify(RegisteredSniffersStore)}`);
  const { presentLogs, getLogsInTime, graphUpdateCount } = RegisteredSniffersStore;

  const definition1 = { url: "url", port: "port", data: [{ "y": 39, "x": 1 }, { "y": 65, "x": 3 }] };
  let chartsArray = [];
  {Object.keys(presentLogs).map(url => {
    Object.keys(presentLogs[url]).map(port => {
      const definition = { url: url, port: port, data: presentLogs[url][port] };
      // console.log(`chart = ${JSON.stringify(definition)}`);
      chartsArray.push(<Chart {...definition} />);
    })
  })}

  graphUpdateCount();
  return (
    <View style={styles.view}>
      <Button title="get logs" onPress={() => getLogsInTime(10)} />

      <ScrollView>
        {chartsArray.map(item => item)}
        {/* <VictoryChart
          theme={VictoryTheme.material}
        >
          <VictoryLine
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc" }
            }}
            data={[{ y: 42, x: 0 }, { y: 51, x: 1 }]}
            x={item => item.x}
            y={item => item.y}
            animate={false}
          />
        </VictoryChart>

        <VictoryChart
          theme={VictoryTheme.material}
        >
          <VictoryLine
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc" }
            }}
            data={[{ y: 42, x: 0 }, { y: 51, x: 1 }]}
            x={item => item.x}
            y={item => item.y}
            animate={false}
          />
        </VictoryChart> */}
      </ScrollView>
      <ScreenBase openRoutesMenu={() => navigation.openDrawer()} />
    </View>
  );
}

export default inject('RegisteredSniffersStore')(observer(Sensores));
