import { View, Text, Button, ScrollView, Dimensions } from "react-native";
import { ScreenBase } from "../common/ScreenBase";
import { observer, inject } from 'mobx-react';
import { styles } from '../../../App.styles';
import { Canvas, Skia, Path, SkiaView } from "@shopify/react-native-skia";
import { useState } from "react";

class LineChart {
  constructor(xScale, yScale) {
    this.xScale = {
      min: xScale[0],
      max: xScale[1],
    }
    this.yScale = {
      min: yScale[0],
      max: yScale[1],
    }
    this.path = Skia.Path.Make();
    this.pathStatus = {
      moved: false,
    }
    this.lastXAxisIndex = 0;
    this.axisScale = {
      x: 5,
      y: 1,
    };
  }

  pushData = data => {
    const limit = 50;
    let tmpComands = this.path.toCmds();
    if (tmpComands.length > 0) {
      if (tmpComands.length < limit) {
        this.path.lineTo(this.lastXAxisIndex * this.axisScale.x, data * this.axisScale.y);
      } else {
        this.lastXAxisIndex -= 1;
        for (let i = tmpComands.length - 1; i > 0; i--) {
          tmpComands[i][1] = tmpComands[i - 1][1];
        }
        this.path.rewind();
        this.path.moveTo(tmpComands[1][1], tmpComands[1][2]);
        for (let i = 2; i < tmpComands.length; i++) {
          this.path.lineTo(tmpComands[i][1], tmpComands[i][2]);
        }
        this.path.lineTo(this.lastXAxisIndex * this.axisScale.x, data * this.axisScale.y);
      }
    }
    else {
      this.path.moveTo(this.lastXAxisIndex * this.axisScale.x, data * this.axisScale.y);
    }
    this.lastXAxisIndex += 1;
  }

  loadDataVector = vector => {
    for (let i = 0; i < vector.length; i++) {
      this.pushData(vector[i])
    }
  }

  getPath = () => {
    return this.path;
  }
}

function Sensores({ navigation, RegisteredSniffersStore }) {
  const { presentLogs, getLogsInTime } = RegisteredSniffersStore;

  const [render, setRender] = useState(false);

  const lineChart = new LineChart([0, 100], [0, 255]);
  const lineChart1 = new LineChart([0, 100], [0, 255]);

  setInterval(() => {
    if (render) {
      lineChart.pushData(Math.random() * 256);
      lineChart1.pushData(Math.random() * 256);
    }
  }, 50);

  const viewMarging = 24;
  const strokeWidth = 16;
  const screeWidth = Dimensions.get('window').width;
  const viewWidth = screeWidth - (2 * viewMarging);
  const drawWidth = viewWidth - (strokeWidth * 2);

  return (
    <View style={{ margin: viewMarging, width: viewWidth }}>
      <Button title="get logs" onPress={() => setRender(!render)} />
      <ScrollView>
        <Canvas style={{ width: viewWidth, height: viewWidth }} mode='continuous' debug={true} >
          <Path path={lineChart.getPath()} style="stroke" color="tomato" strokeWidth={3} />
        </Canvas>
        <Canvas style={{ width: viewWidth, height: viewWidth }} mode='continuous' debug={true} >
          <Path path={lineChart1.getPath()} style="stroke" color="turquoise" strokeWidth={3} />
        </Canvas>
      </ScrollView>
      <ScreenBase openRoutesMenu={() => navigation.openDrawer()} />
    </View>
  );
}

export default inject('RegisteredSniffersStore')(observer(Sensores));
