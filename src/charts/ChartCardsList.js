import { ChartCard } from './ChartCard';
import { StyleSheet, ScrollView, View, Text } from "react-native";


const styles = StyleSheet.create({
  scrollView: {flex: 1},
});


export function ChartCardsList({ sensorConfigsArray }) {
  // const array = [
  //   {
  //     sensorName: "nome do sensor",
  //     sensorType: "ultrassonic",
  //     timeFrame: 10, // faixa de tempo do eixo x em segundos
  //     logsRate: 1000, // quantidade dos logs por segundo
  //     drawPath: Skia.Path.Make(),
  //     xAxisPath: Skia.Path.Make()
  //   },
  //   ...
  // ];

  return (
    <ScrollView style={styles.scrollView}>
      {sensorConfigsArray.map(sensorConfig => <ChartCard key={Math.random()} sensorConfig={sensorConfig} />)}
    </ScrollView>
  );
}
