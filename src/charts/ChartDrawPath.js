import { Skia } from "@shopify/react-native-skia";
import { CanvasDimensions } from './CanvasDimensions';


export class ChartDrawPath {
  constructor(sensorType, timeFrame = 10, logsRate = 1000) {
    this.path = Skia.Path.Make();
    this.path.setIsVolatile(false);

    this.xBounds = { min: 0, max: timeFrame * logsRate };
    this.yBounds = { min: 0 };
    if (sensorType == 'touch') {
      this.yBounds['max'] = 1;
    } else if (sensorType == 'ultrassonic') {
      this.yBounds['max'] = 255;
    }
    // this.canvasDimensions = new CanvasDimensions();
    this.lineDrawPoints = new CanvasDimensions().lineDrawPoints;
    this.axisLength = { x: this.lineDrawPoints.rightBottom.x - this.lineDrawPoints.leftBottom.x, y: this.lineDrawPoints.rightTop.y - this.lineDrawPoints.rightBottom.y };
    this.dimensionsUnits = { x: this.axisLength.x / this.xBounds.max, y: this.axisLength.y / this.yBounds.max };
    this.lastPointTime = 0;
    console.log(`${this.axisLength.x} == ${this.dimensionsUnits.x} * ${this.xBounds.max} == ${this.dimensionsUnits.x * this.xBounds.max}`);
  }

  pushData = data => {
    // const data = {
    //   value: '', // string com o valor do sensor 
    //   time: 15000 // inteiro com o valor de tempo em ms que se passou após o início da execução
    // };
    const y = parseInt(data.value) * this.dimensionsUnits.y;
    const timeDiff = (data.time - this.lastPointTime) * this.dimensionsUnits.x;
    const x = (this.path.getLastPt().x + timeDiff);

    if (x > this.lineDrawPoints.rightBottom.x) {
      const offSet = x - this.lineDrawPoints.rightBottom.x;
      this.path.offset(- offSet, 0);
      // no emulador usando a operação de trim o canvas ficava lento
      // const trim = this.axisLength.x / this.path.getPoint(0).x - this.path.getLastPt().x;
      // this.path.trim(trim, 1, false);
      this.path.lineTo(this.path.getLastPt().x + offSet, y);
    }
    else {
      this.path.lineTo(x, y);
    }

    this.lastPointTime = data.time;
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
