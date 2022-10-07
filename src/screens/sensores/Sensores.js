import { View, Text, Button, ScrollView, Dimensions } from "react-native";
import { ScreenBase } from "../common/ScreenBase";
import { observer, inject } from 'mobx-react';
import { Canvas, Path } from "@shopify/react-native-skia";
import { StyleSheet } from "react-native";
import { useState } from "react";


function Sensores({ navigation, RegisteredSniffersStore }) {
  const { getAllPortChart, lastCmdToAllWsClients, startLogs, stopLogs } = RegisteredSniffersStore;
  
  const [port1PathString, setPort1PathString] = useState("");
  const [port2PathString, setPort2PathString] = useState("");
  // let port1PathString = "";
  // let port2PathString = "";
  let port1PathStringBuffer = [];
  let port2PathStringBuffer = [];
  let xIndexCounter = 0;
  const limit = 1000;

  setInterval(() => {
    if (port1PathStringBuffer.length >= limit) {
      xIndexCounter -= 1;
      for (let i = port1PathStringBuffer.length - 1; i > 0; i--) {
        port1PathStringBuffer[i][0] = port1PathStringBuffer[i - 1][0];
        port2PathStringBuffer[i][0] = port2PathStringBuffer[i - 1][0];
      }
      port1PathStringBuffer.shift();
      port2PathStringBuffer.shift();
      port1PathStringBuffer.push([xIndexCounter * 5, Math.random() * 256]);
      port2PathStringBuffer.push([xIndexCounter * 5, Math.random() * 256]);
    } else {
      port1PathStringBuffer.push([xIndexCounter * 5, Math.random() * 256]);
      port2PathStringBuffer.push([xIndexCounter * 5, Math.random() * 256]);
    }
    let tmpPort1PathString = `M ${port1PathStringBuffer[0][0]} ${port1PathStringBuffer[0][1]}`;
    let tmpPort2PathString = `M ${port2PathStringBuffer[0][0]} ${port2PathStringBuffer[0][1]}`;
    for (let i = 1; i < port1PathStringBuffer.length; i++) {
      tmpPort1PathString += ` L ${port1PathStringBuffer[i][0]} ${port1PathStringBuffer[i][1]}`;
      tmpPort2PathString += ` L ${port2PathStringBuffer[i][0]} ${port2PathStringBuffer[i][1]}`;
    }
    setPort1PathString(tmpPort1PathString);
    setPort2PathString(tmpPort2PathString);
    // port1PathString = tmpPort1PathString;
    // port2PathString = tmpPort2PathString;
    xIndexCounter += 1;
  }, 100);

  const viewMarging = 24;
  const strokeWidth = 16;
  const screeWidth = Dimensions.get('window').width;
  const viewWidth = screeWidth - (2 * viewMarging);
  const drawWidth = viewWidth - (strokeWidth * 2);

  // calculando dimensões
  const screenDimensions = Dimensions.get('window');
  const horizontalScrollViewMargin = 10;
  const axisLabelThickness = 15;
  const yAxisDimensions = { width: axisLabelThickness, height: 256 + 10 } // height: valor máximo do sensor de ultrassônico + tamanho do texto dos números do eixo y
  const canvasWidth = screenDimensions.width - horizontalScrollViewMargin;
  const xAxisDimensions = { width: canvasWidth - yAxisDimensions.width, height: axisLabelThickness }
  const canvasHeight = yAxisDimensions.height; // valor máximo do sensor de ultrassônico

  const styles = StyleSheet.create({
    returnView: { flex: 1 },
    ButtonAndScrollView: { marginHorizontal: horizontalScrollViewMargin, marginTop: 24 },
    Button: {},
    ScrollView: { marginHorizontal: horizontalScrollViewMargin, marginTop: 8 },
    Canvas: { height: yAxisDimensions.height, width: canvasWidth },
    LastCanvas: { height: yAxisDimensions.height, width: canvasWidth, marginBottom: 110 }
  });

  let CanvasList = [];
  const portCharts = getAllPortChart();
  for (let i = 0; i < portCharts.length; i++) {
    if (i == portCharts.length - 1) {
      CanvasList.push(
        <Canvas key={`${portCharts[i].url}${portCharts[i].port}`} style={styles.LastCanvas} mode='continuous' debug={true} >
          <Path path={port2PathString} style="stroke" color="tomato" strokeWidth={2} />
        </Canvas>
      );
    } else {
      CanvasList.push(
        <Canvas key={`${portCharts[i].url}${portCharts[i].port}`} style={styles.Canvas} mode='continuous' debug={true} >
          <Path path={port1PathString} style="stroke" color="tomato" strokeWidth={2} />
        </Canvas>
      );
    }
  }

  return (
    <View style={styles.returnView}>
      <View style={styles.ButtonAndScrollView}>
        <Button style={styles.Button} title={lastCmdToAllWsClients == "stop logs" ? "get logs" : "stop logs"} onPress={() => {
          if (lastCmdToAllWsClients == "stop logs") {
            startLogs();
          } else {
            stopLogs();
          }
        }} />
        <ScrollView style={styles.ScrollView}>
          {CanvasList}
        </ScrollView>
      </View>
      <ScreenBase openRoutesMenu={() => navigation.openDrawer()} />
    </View>
  );
}

export default inject('RegisteredSniffersStore')(observer(Sensores));
