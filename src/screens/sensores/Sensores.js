import { View, Text, Button, ScrollView, Dimensions } from "react-native";
import { ScreenBase } from "../common/ScreenBase";
import { observer, inject } from 'mobx-react';
import { styles } from '../../../App.styles';
import { Canvas, Skia, Path, SkiaView } from "@shopify/react-native-skia";
import { useState } from "react";


function Sensores({ navigation, RegisteredSniffersStore }) {
  const { presentLogs, getLogsInTime, getAllPortChart } = RegisteredSniffersStore;

  const viewMarging = 24;
  const strokeWidth = 16;
  const screeWidth = Dimensions.get('window').width;
  const viewWidth = screeWidth - (2 * viewMarging);
  const drawWidth = viewWidth - (strokeWidth * 2);

  let chartsArray = [];
  const allPortChart = getAllPortChart();
  for (let i = 0; i < allPortChart.length; i++) {
    chartsArray.push(
      <Canvas key={`${allPortChart[i].url}${allPortChart[i].port}`} style={{ width: viewWidth, height: viewWidth }} mode='continuous' debug={true} >
        <Path path={allPortChart[i].chart.getPath()} style="stroke" color="tomato" strokeWidth={3} />
      </Canvas>
    );
  }

  const [render, setRender] = useState(false);
  const [thread, setThread] = useState(null);

  return (
    <View style={{ margin: viewMarging, width: viewWidth }}>
      <Button title={render ? "stop logs" : "get logs"} onPress={() => {
        if (allPortChart.length > 0) {
          if (render) {
            setRender(false);
            clearTimeout(thread);
            setThread(null);
          } else {
            setRender(true);
            setThread(setInterval(() => {
              for (let i = 0; i < allPortChart.length; i++) {
                allPortChart[i].chart.pushData(Math.random() * 256);
              }
            }, 100));
          }
        } else {
          setRender(false);
          clearInterval(thread);
          setThread(null);
        }
      }} />
      <ScrollView>
        {chartsArray}
      </ScrollView>
      <ScreenBase openRoutesMenu={() => navigation.openDrawer()} />
    </View>
  );
}

export default inject('RegisteredSniffersStore')(observer(Sensores));
