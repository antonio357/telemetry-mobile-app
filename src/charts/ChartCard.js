import { StyleSheet, View, Text } from "react-native";
import { Canvas, Path } from "@shopify/react-native-skia";
import { CanvasDimensions } from './CanvasDimensions';


const dimensions = new CanvasDimensions();

const styles = StyleSheet.create({
  view: { flex: 1 },
  text: {},
  canvas: { height: dimensions.canvasDimensions.height, width: dimensions.canvasDimensions.width },
  yAxisDrawPath: {},
  drawPath: {},
  xAxisDrawPath: {},
});

export function ChartCard({ sensorConfig }) {
  // const sensorConfig = {
  //   sensorName: "nome do sensor",
  //   sensorType: "ultrassonic",
  //   timeFrame: 10, // faixa de tempo do eixo x em segundos
  //   logsRate: 1000, // quantidade dos logs por segundo
  //   drawPath: Skia.Path.Make()
  // }

  return (
    <View style={styles.view}>
      <Text>{sensorConfig.sensorName} : {sensorConfig.sensorType}</Text>
      <Canvas style={styles.canvas} mode='continuous' debug={true}>
        {/* path pro eixo y */}
        <Path path={sensorConfig.drawPath} style="stroke" color="tomato" strokeWidth={1} />
        {/* path pro eixo x */}
      </Canvas>
    </View>
  );
}
