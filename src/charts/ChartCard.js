import { StyleSheet, View, Text } from "react-native";
import { Canvas, Path } from "@shopify/react-native-skia";
import { CanvasDimensions } from './CanvasDimensions';


const dimensions = new CanvasDimensions();

const styles = StyleSheet.create({
  canvas: { height: dimensions.canvasDimensions.height, width: dimensions.canvasDimensions.width },
  yAxisDrawPath: {},
  drawPath: {},
  xAxisDrawPath: {},
  yAxisCanvas: { flexDirection: 'row' },
  yAxisText: { flex: 1, flexDirection: 'column', height: 68, fontSize: 12, textAlign: "right" }
});

function YAxisLabel() {
  return (
    <View style={styles.yAxis}>
      <Text key={1} style={styles.yAxisText}>255</Text>
      <Text key={2} style={styles.yAxisText}>128</Text>
      <Text key={3} style={styles.yAxisText}>64</Text>
      <Text key={4} style={styles.yAxisText}>0</Text>
    </View>
  )
}

export function ChartCard({ sensorConfig }) {
  // const sensorConfig = {
  //   sensorName: "nome do sensor",
  //   sensorType: "ultrassonic",
  //   timeFrame: 10, // faixa de tempo do eixo x em segundos
  //   logsRate: 1000, // quantidade dos logs por segundo
  //   drawPath: Skia.Path.Make()
  // }

  return (
    <View>
      <Text style={styles.chartName} >{sensorConfig.sensorName} : {sensorConfig.sensorType}</Text>
      <View style={styles.yAxisCanvas}>
        <YAxisLabel />
        <Canvas style={styles.canvas} mode='continuous' debug={true}>
          {/* path pro eixo y */}
          <Path path={sensorConfig.drawPath} style="stroke" color="tomato" strokeWidth={1} />
          {/* path pro eixo x */}
        </Canvas>
      </View>
    </View>
  );
}
