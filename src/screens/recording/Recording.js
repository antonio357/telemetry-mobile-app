import { View } from "react-native";
import { ScreenBase } from "../common/ScreenBase";
import { styles } from '../../../App.styles';
import { observer, inject } from 'mobx-react';
// import { ChartCardsList } from '../../charts/ChartCardsList';
// import { ChartDrawPath } from '../../charts/ChartDrawPath';

// const path1 =  new ChartDrawPath('ultrassonic');
// const path2 =  new ChartDrawPath('touch');
// const array = [
//   {
//     sensorName: "sensor de distância",
//     sensorType: "ultrassonic",
//     timeFrame: 10, // faixa de tempo do eixo x em segundos
//     logsRate: 1000, // quantidade dos logs por segundo
//     drawPath: path1.getPath()
//   },
//   {
//     sensorName: "sensor de batida",
//     sensorType: "touch",
//     timeFrame: 10, // faixa de tempo do eixo x em segundos
//     logsRate: 1000, // quantidade dos logs por segundo
//     drawPath: path2.getPath()
//   },
// ];
// let timeCounter = 0;
// const thread = setInterval(() => {
//   let array1 = [];
//   let array2 = [];
//   for (let i = 0; i < 20; i++) {
//     array1.push({value: Math.random() * 256, time: timeCounter});
//     array2.push({value: Math.random() * 2, time: timeCounter});
//     timeCounter += 1;
//   }
//   path1.loadDataVector(array1);
//   path2.loadDataVector(array2);
// }, 20);

function Recording({ navigation, RegisteredSniffersStore }) {
  // const { getAllPortChart } = RegisteredSniffersStore;
  // console.log(`getAllPortChart() = ${JSON.stringify(getAllPortChart())}`);

  return (
    <View style={styles.view}>
      {/* <ChartCardsList sensorConfigsArray={array} /> */}
      <ScreenBase openRoutesMenu={() => navigation.openDrawer()} />
    </View>
  )
}

export default inject('RegisteredSniffersStore')(observer(Recording));