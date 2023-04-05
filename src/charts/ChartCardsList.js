import { ChartCard } from './ChartCard';
import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
  // scrollView: {flex: 1},
});


export function ChartCardsList({ sensorConfigsArray }) {
  // const array = [
  //   {
  //     sensorName: "nome do sensor",
  //     sensorType: "ultrassonic",
  //     timeFrame: 10, // faixa de tempo do eixo x em segundos
  //     logsRate: 1000, // quantidade dos logs por segundo
  //     drawPath: Skia.Path.Make()
  //   },
  //   ...
  // ];

  return (
    <>
      {sensorConfigsArray.map(sensorConfig => <ChartCard key={Math.random()} sensorConfig={sensorConfig} />)}
    </>
  );
}
