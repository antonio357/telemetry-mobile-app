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
      <Canvas key={allPortChart[i].url} style={{ width: viewWidth, height: viewWidth }} mode='continuous' debug={true} >
        <Path path={allPortChart[i].path.getPath()} style="stroke" color="tomato" strokeWidth={3} />
      </Canvas>
    );
  }

  const [render, setRender] = useState(false);

  setInterval(() => {
    if (render) {
      for (let i = 0; i < allPortChart.length; i++) {
        allPortChart[i].path.pushData(Math.random() * 256);
      }
    }
  }, 50);

  return (
    <View style={{ margin: viewMarging, width: viewWidth }}>
      <Button title="get logs" onPress={() => setRender(!render)} />
      <ScrollView>
        {chartsArray}
      </ScrollView>
      <ScreenBase openRoutesMenu={() => navigation.openDrawer()} />
    </View>
  );
}

export default inject('RegisteredSniffersStore')(observer(Sensores));
