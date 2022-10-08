import { View, Text, Button, ScrollView, Dimensions } from "react-native";
import { ScreenBase } from "../common/ScreenBase";
import { observer, inject } from 'mobx-react';
import { Canvas, Path } from "@shopify/react-native-skia";
import { StyleSheet } from "react-native";


function Sensores({ navigation, RegisteredSniffersStore }) {
  const { getAllPortChart, lastCmdToAllWsClients, startLogs, stopLogs } = RegisteredSniffersStore;

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
  let CanvasStyle;
  for (let i = 0; i < portCharts.length; i++) {
    CanvasStyle = styles.Canvas;
    if (i == portCharts.length - 1) {
      CanvasStyle = styles.LastCanvas;
    } else {
      CanvasStyle = styles.Canvas;
    }
    CanvasList.push(
      <Canvas key={`${portCharts[i].url}${portCharts[i].port}`} style={CanvasStyle} mode='continuous' debug={true} >
        <Path path={portCharts[i].chart.getPath()} style="stroke" color="tomato" strokeWidth={1} />
      </Canvas>
    );
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
