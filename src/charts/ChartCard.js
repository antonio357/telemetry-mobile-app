import { StyleSheet, View, Text } from "react-native";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
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

function XAxisLabel() {
  return (
    <View style={styles.yAxis}>
      <Text key={1} style={styles.yAxisText}>255</Text>
      <Text key={2} style={styles.yAxisText}>128</Text>
      <Text key={3} style={styles.yAxisText}>64</Text>
      <Text key={4} style={styles.yAxisText}>0</Text>
    </View>
  )
}

function digit(num, beginPositionCordinate, unit = 5) {
  // c---d
  // |   |
  // b---e
  // |   |
  // a---f
  const displayPoints = {
    a: `${beginPositionCordinate.x} ${beginPositionCordinate.y}`,
    b: `${beginPositionCordinate.x} ${beginPositionCordinate.y - unit}`,
    c: `${beginPositionCordinate.x} ${beginPositionCordinate.y - unit * 2}`,
    d: `${beginPositionCordinate.x + unit} ${beginPositionCordinate.y - unit * 2}`,
    e: `${beginPositionCordinate.x + unit} ${beginPositionCordinate.y - unit}`,
    f: `${beginPositionCordinate.x + unit} ${beginPositionCordinate.y}`,
  }
  const digitsPaths = {
    '0': `M ${displayPoints.a} L ${displayPoints.b} L ${displayPoints.c} L ${displayPoints.d} L ${displayPoints.e} L ${displayPoints.f} L ${displayPoints.a}`,
    '1': `M ${displayPoints.d} L ${displayPoints.e} L ${displayPoints.f}`,
    '2': `M ${displayPoints.c} L ${displayPoints.d} L ${displayPoints.e} L ${displayPoints.b} L ${displayPoints.a} L ${displayPoints.f}`,
    '3': `M ${displayPoints.c} L ${displayPoints.d} L ${displayPoints.f} L ${displayPoints.a} M ${displayPoints.e} L ${displayPoints.b}`,
    '4': `M ${displayPoints.c} L ${displayPoints.b} L ${displayPoints.e} M ${displayPoints.d} L ${displayPoints.f}`,
    '5': `M ${displayPoints.d} L ${displayPoints.c} L ${displayPoints.b} L ${displayPoints.e} L ${displayPoints.f} L ${displayPoints.a}`,
    '6': `M ${displayPoints.d} L ${displayPoints.c} L ${displayPoints.b} L ${displayPoints.e} L ${displayPoints.f} L ${displayPoints.a} L ${displayPoints.b}`,
    '7': `M ${displayPoints.c} L ${displayPoints.d} L ${displayPoints.f}`,
    '8': `M ${displayPoints.a} L ${displayPoints.c} L ${displayPoints.d} L ${displayPoints.f} L ${displayPoints.a} M ${displayPoints.b} L ${displayPoints.e}`,
    '9': `M ${displayPoints.a} L ${displayPoints.f} L ${displayPoints.d} L ${displayPoints.c} L ${displayPoints.b} L ${displayPoints.e}`,
  }

  return digitsPaths[num];
}

function timePath(beginPositionCordinate, ) {

}

export function ChartCard({ sensorConfig }) {
  // const sensorConfig = {
  //   sensorName: "nome do sensor",
  //   sensorType: "ultrassonic",
  //   timeFrame: 10, // faixa de tempo do eixo x em segundos
  //   logsRate: 1000, // quantidade dos logs por segundo
  //   drawPath: Skia.Path.Make(),
  //   xAxisPath: Skia.Path.Make()
  // }

  const xAxisPath = Skia.Path.Make();
  // xAxisPath.moveTo(0, -600);
  xAxisPath.lineTo(0, 600);
  // xAxisPath.lineTo(100, 400);
  const xbegin = 0;
  const ybegin = 100;
  const unit = 10;

  return (
    <View>
      <Text style={styles.chartName} >{sensorConfig.sensorName} : {sensorConfig.sensorType}</Text>
      <View style={styles.yAxisCanvas}>
        <YAxisLabel />
        <Canvas style={styles.canvas} mode='continuous' debug={true}>
          {/* path pro eixo y */}
          <Path path={sensorConfig.drawPath} style="stroke" color="tomato" strokeWidth={1} />
          {/* path pro eixo x */}
          <Path path={digit(0, { x: 0, y: (styles.canvas.height / 2)})} style="stroke" color="black" strokeWidth={1.5} />
          <Path path={digit(1, { x: 15, y: (styles.canvas.height / 2)})} style="stroke" color="black" strokeWidth={1.5} />
          <Path path={digit(2, { x: 30, y: (styles.canvas.height / 2)})} style="stroke" color="black" strokeWidth={1.5} />
          <Path path={digit(3, { x: 45, y: (styles.canvas.height / 2)})} style="stroke" color="black" strokeWidth={1.5} />
          <Path path={digit(4, { x: 60, y: (styles.canvas.height / 2)})} style="stroke" color="black" strokeWidth={1.5} />
          <Path path={digit(5, { x: 75, y: (styles.canvas.height / 2)})} style="stroke" color="black" strokeWidth={1.5} />
          <Path path={digit(6, { x: 90, y: (styles.canvas.height / 2)})} style="stroke" color="black" strokeWidth={1.5} />
          <Path path={digit(7, { x: 105, y: (styles.canvas.height / 2)})} style="stroke" color="black" strokeWidth={1.5} />
          <Path path={digit(8, { x: 120, y: (styles.canvas.height / 2)})} style="stroke" color="black" strokeWidth={1.5} />
          <Path path={digit(9, { x: 135, y: (styles.canvas.height / 2)})} style="stroke" color="black" strokeWidth={1.5} />
        </Canvas>
        {/* <XAxisLabel /> */}
      </View>
    </View>
  );
}
