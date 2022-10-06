import { View, Text, Button, ScrollView, Dimensions } from "react-native";
import { ScreenBase } from "../common/ScreenBase";
import { observer, inject } from 'mobx-react';
import { Canvas, Path } from "@shopify/react-native-skia";


function Sensores({ navigation, RegisteredSniffersStore }) {
  const { getAllPortChart, lastCmdToAllWsClients, startLogs, stopLogs } = RegisteredSniffersStore;

  const viewMarging = 24;
  const strokeWidth = 16;
  const screeWidth = Dimensions.get('window').width;
  const viewWidth = screeWidth - (2 * viewMarging);
  const drawWidth = viewWidth - (strokeWidth * 2);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ margin: viewMarging }}>
        <Button title={lastCmdToAllWsClients == "stop logs" ? "get logs" : "stop logs"} onPress={() => {
          if (lastCmdToAllWsClients == "stop logs") {
            startLogs();
          } else {
            stopLogs();
          }
        }} />
        <ScrollView style={{ margin: viewMarging, width: viewWidth }}>
          {getAllPortChart().map(portChart => {
            return (
              <Canvas key={`${portChart.url}${portChart.port}`} style={{ width: viewWidth, height: viewWidth }} mode='continuous' debug={true} >
                <Path path={portChart.chart.getPath()} style="stroke" color="tomato" strokeWidth={3} />
              </Canvas>
            );
          })}
        </ScrollView>
      </View>
      <ScreenBase openRoutesMenu={() => navigation.openDrawer()} />
    </View>
  );
}

export default inject('RegisteredSniffersStore')(observer(Sensores));
