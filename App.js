// decalrative api
// import { Canvas, Circle, Group } from "@shopify/react-native-skia";
// import { View, Text } from 'react-native';


// const App = () => {
//   const size = 256;
//   const r = size * 0.33;
//   return (
//     <Canvas style={{ flex: 1 }}>
//       <Group blendMode="multiply">
//         <Circle cx={r} cy={r} r={r} color="cyan" />
//         <Circle cx={size - r} cy={r} r={r} color="magenta" />
//         <Circle
//           cx={size / 2}
//           cy={size - r}
//           r={r}
//           color="yellow"
//         />
//       </Group>
//     </Canvas>
//   );
// };

// imperative api
// import { Skia, BlendMode, SkiaView, useDrawCallback } from "@shopify/react-native-skia";


// const paint = Skia.Paint();
// paint.setAntiAlias(true);
// paint.setBlendMode(BlendMode.Multiply);

// const App = () => {
//   const width = 256;
//   const height = 256;
//   const r = 92;
//   const onDraw = useDrawCallback((canvas) => {
//     console.log('onDraw');
//     // Cyan Circle
//     const cyan = paint.copy();
//     cyan.setColor(Skia.Color("cyan"));
//     canvas.drawCircle(r, r, r, cyan);
//     // Magenta Circle
//     const magenta = paint.copy();
//     magenta.setColor(Skia.Color("magenta"));
//     canvas.drawCircle(width - r, r, r, magenta);
//     // Yellow Circle
//     const yellow = paint.copy();
//     yellow.setColor(Skia.Color("yellow"));
//     canvas.drawCircle(width / 2, height - r, r, yellow);
//   });
//   return (
//     <SkiaView style={{ flex: 1 }} onDraw={onDraw} />
//   );
// };

// import {useEffect} from "react";
// import {Canvas, Image, useCanvasRef, Circle} from "@shopify/react-native-skia";


// const App = () => {
//   const ref = useCanvasRef();
//   useEffect(() => {
//     setTimeout(() => {
//       // you can pass an optional rectangle
//       // to only save part of the image
//       const image = ref.current?.makeImageSnapshot();
//       if (image) {
//         // you can use image in an <Image> component
//         // Or save to file using encodeToBytes -> Uint8Array
//         const bytes = image.encodeToBytes();
//       }
//     }, 1000)
//   });
//   return (
//     <Canvas style={{ flex: 1 }} ref={ref}>
//       <Circle r={128} cx={128} cy={128} color="red" />
//     </Canvas>
//   );
// };

// import { Canvas, Path, Skia } from "@shopify/react-native-skia";


// const path = Skia.Path.Make();
// path.moveTo(128, 0);
// path.lineTo(168, 80);
// path.lineTo(256, 93);
// path.lineTo(192, 155);
// path.lineTo(207, 244);
// path.lineTo(128, 202);
// path.lineTo(49, 244);
// path.lineTo(64, 155);
// path.lineTo(0, 93);
// path.lineTo(88, 80);
// path.lineTo(128, 0);
// path.close();

// const App = () => {
//   return (
//     <Canvas style={{ flex: 1 }}>
//       <Path
//         path={path}
//         color="lightblue"
//       />
//     </Canvas>
//   );
// };

// import React from "react";
// import { Canvas, Circle, Group, useLoop, useDerivedValue, Easing, useTouchHandler, useValue } from "@shopify/react-native-skia";

// const App = () => {
//   const width = 495
//   const height = width
//   const r = 180
//   const loop = useLoop({ duration: 2000, easing: Easing.inOut(Easing.cubic) })
//   const radius = useDerivedValue((l) => 10 + l * 180, [loop])
//   const cx = useDerivedValue((l) => 10 + l * 180, [loop])

//   const mause = useValue({ x: 0, y: 0 })

//   const touchHandler = useTouchHandler({
//     onActive: ({x, y}) => {
//       mause.current = {x, y}
//     }
//   })

//   const transform = useDerivedValue(
//     (m) => [{translateX: m.x - 150}, {translateY: m.y - 150}],
//     [mause]
//   )

//   return (
//     <Canvas style={{ flex: 1, heigh: 500 }} onTouch={touchHandler}>
//      <Group blendMode="multiply" transform={transform}>
//       <Circle cx={cx} cy={r} r={radius} color="cyan"/>
//       <Circle cx={width - r} cy={r} r={radius} color="magenta"/>
//       <Circle cx={width / 2} cy={height - r} r={radius} color="yellow"/>
//      </Group>
//     </Canvas>
//   );
// };


// import { Canvas, Circle, Group, useLoop, useDerivedValue, Easing, useTouchHandler, useValue, Path, usePath, Skia } from "@shopify/react-native-skia";
// const data = [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0];

// const path = Skia.Path.Make();

// const App = () => {

//   const startX = 20;
//   const startY = 100;
//   path.moveTo(startX, startY - data[0] * 20);
//   for (let i = 1; i < data.length; i++) {
//     path.lineTo(startX + i * 20, startY - data[i] * 20)
//   }

//   return (
//     <Canvas style={{ flex: 1, heigh: 500 }}>
//       <Group blendMode="multiply" >
//         <Path path={path} style="stroke" color="red" strokeWidth={5} />
//       </Group>
//     </Canvas>
//   );
// }


import { Canvas, Skia, Path, PathOp } from "@shopify/react-native-skia";

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
    this.dataCounter = 0;
    this.axisScale = {
      x: 5,
      y: 1,
    };
  }

  pushData = data => {
    const limit = 100;
    let tmpComands = this.path.toCmds();
    if (tmpComands.length > 0) {
      if (tmpComands.length < limit) {
        this.path.lineTo(this.dataCounter * this.axisScale.x, data * this.axisScale.y);
      } else {
        this.dataCounter = 0;
        tmpComands.shift();
        let counter = 0; 
        for (let i = 0; i < tmpComands.length; i++) {
          counter += 1;
          tmpComands[i][1] = counter * this.axisScale.x;
        }
        this.path.rewind();
        this.path.moveTo(tmpComands[0][1], tmpComands[0][2]);
        for (let i = 1; i < tmpComands.length; i++) {
          this.path.lineTo(tmpComands[i][1], tmpComands[i][2]);
        }
      }
    }
     else {
      this.path.moveTo(this.dataCounter * this.axisScale.x, data * this.axisScale.y);
    }
    this.dataCounter += 1;
  }

  loadDataVector = vector => {
    let counter = 0;
    for (let i = 0; i < vector.length; i++) {
      counter += 1;
      setTimeout(() => this.pushData(vector[i]), 10 * counter);
    }
    // setTimeout(() => {
    //   let dms = this.path.toCmds();
    //   for (let i = 0; i < 10; i++) dms.shift();
    //   this.path.rewind();
    //   setTimeout(() => {
    //     this.path.moveTo(dms[0][1], dms[0][2]);
    //     for (let i = 1; i < dms.length; i++) {
    //       this.path.lineTo(dms[i][1], dms[i][2])
    //     }
    //   }, 2000);
    //   // this.path.toCmds().push(this.path.toCmds())
    // }, 2000);

  }

  getPath = () => {
    return this.path;
  }
}

const App = () => {
  const lineChart = new LineChart([0, 100], [0, 255]);
  const path = lineChart.getPath();

  // const vector = [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0];
  const vector = [];
  for (let i = 0; i < 50000; i++) {
    // vector.push(i % 6);
    vector.push(Math.floor(Math.random() * 256));
  }
  lineChart.loadDataVector(vector);

  return (
    <Canvas style={{ flex: 1, heigh: 500 }} mode='continuous' debug={true} >
      <Path path={path} style="stroke" color="red" strokeWidth={3} />
    </Canvas>
  );
}

export default App;
