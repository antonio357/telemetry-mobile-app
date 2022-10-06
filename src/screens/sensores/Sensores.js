import { View, Text, Button, ScrollView, Dimensions } from "react-native";
import { ScreenBase } from "../common/ScreenBase";
import { observer, inject } from 'mobx-react';
import { styles } from '../../../App.styles';
import { Canvas, Skia, Path, SkiaView } from "@shopify/react-native-skia";
import { useState } from "react";


function Sensores({ navigation, RegisteredSniffersStore }) {
  const { getAllPortChart, lastCmdToAllWsClients, startLogs, stopLogs } = RegisteredSniffersStore;

  const viewMarging = 24;
  const strokeWidth = 16;
  const screeWidth = Dimensions.get('window').width;
  const viewWidth = screeWidth - (2 * viewMarging);
  const drawWidth = viewWidth - (strokeWidth * 2);

  // let chartsArray = [];
  // const allPortChart = getAllPortChart();
  // for (let i = 0; i < allPortChart.length; i++) {
  //   chartsArray.push(
  //     <Canvas key={`${allPortChart[i].url}${allPortChart[i].port}`} style={{ width: viewWidth, height: viewWidth }} mode='continuous' debug={true} >
  //       <Path path={allPortChart[i].chart.getPath()} style="stroke" color="tomato" strokeWidth={3} />
  //     </Canvas>
  //   );
  // }

  return (
    <View style={{ margin: viewMarging, width: viewWidth }}>
      <Button title={lastCmdToAllWsClients == "stop logs" ? "get logs" : "stop logs"} onPress={() => {
        if (lastCmdToAllWsClients == "stop logs") {
          startLogs();
        } else {
          stopLogs();
        }
      }} />
      <ScrollView>
        {getAllPortChart().map(portChart => {
          return (
            <Canvas key={`${portChart.url}${portChart.port}`} style={{ width: viewWidth, height: viewWidth }} mode='continuous' debug={true} >
              <Path path={portChart.chart.getPath()} style="stroke" color="tomato" strokeWidth={3} />
            </Canvas>
          );
        })}
      </ScrollView>
      <ScreenBase openRoutesMenu={() => navigation.openDrawer()} />
    </View>
  );
}

export default inject('RegisteredSniffersStore')(observer(Sensores));
