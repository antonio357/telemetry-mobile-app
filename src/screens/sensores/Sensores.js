import { View, Text, Button, ScrollViewBase } from "react-native";
import { ScreenBase } from "../common/ScreenBase";
import { observer, inject } from 'mobx-react';
import { styles } from '../../../App.styles';
import { VictoryLine, VictoryTheme, VictoryChart } from 'victory-native';


function Chart({ data }) {
  return (
    // <View>
    //   <Text>my chart</Text>
    //   <VictoryChart
    //     theme={VictoryTheme.material}
    //   >
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
    // </VictoryChart>
    // </View>
  );
}

function Sensores({ navigation, RegisteredSniffersStore }) {
  // console.log(`RegisteredSniffersStore = ${JSON.stringify(RegisteredSniffersStore)}`);
  const { presentLogs, getLogsInTime, graphUpdateCount } = RegisteredSniffersStore;

  const definition1 = { url: "url", prot: "port", data: [{ "y": 39, "x": 1 }, { "y": 65, "x": 3 }] };

  graphUpdateCount();
  return (
    <View style={styles.view}>
      <Button title="get logs" onPress={() => getLogsInTime(10)} />


      {/* <Chart {...definition1} />; */}

      {/* {Object.keys(presentLogs).map(url => {
        Object.keys(presentLogs[url]).map(port => {
          const definition = { url: url, prot: port, data: presentLogs[url][port] };
          console.log(`chart = ${JSON.stringify(definition)}`);
          return <Chart {...definition} />;
        })
      })} */}
      <ScrollViewBase>
        <VictoryChart
          theme={VictoryTheme.material}
        >
          <VictoryLine
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc" }
            }}
            data={[{ y: 42, x: 0 }, { y: 51, x: 0 }]}
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
            data={[{ y: 42, x: 0 }, { y: 51, x: 0 }]}
            x={item => item.x}
            y={item => item.y}
            animate={false}
          />
        </VictoryChart>
      </ScrollViewBase>
      <ScreenBase openRoutesMenu={() => navigation.openDrawer()} />
    </View>
  );
}

export default inject('RegisteredSniffersStore')(observer(Sensores));
