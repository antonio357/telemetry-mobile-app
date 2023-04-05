import { View, Button, Dimensions, Text, ScrollView } from "react-native";
import { ScreenBase } from "../common/ScreenBase";
import { observer, inject } from 'mobx-react';
import { StyleSheet } from "react-native";
import { ChartCardsList } from '../../charts/ChartCardsList';


function Sensores({ navigation, RegisteredSniffersStore }) {
  const { getAllportChartForChartCardsList, lastCmdToAllWsClients, startLogs, stopLogs, countLogsRecordsSaved } = RegisteredSniffersStore;

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

  const styles = StyleSheet.create({
    returnView: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ButtonAndScrollView: { marginHorizontal: horizontalScrollViewMargin, marginTop: 24 },
    Button: {},
    ScrollView: { marginHorizontal: horizontalScrollViewMargin, marginTop: 8 },
    Canvas: { height: yAxisDimensions.height, width: canvasWidth },
    LastCanvas: { height: yAxisDimensions.height, width: canvasWidth, marginBottom: 110 }
  });
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
        <Text>DataBase has {countLogsRecordsSaved} logs</Text>
        <ScrollView>
          <ChartCardsList sensorConfigsArray={getAllportChartForChartCardsList()} />
        </ScrollView>
      </View>
      <ScreenBase openRoutesMenu={() => navigation.openDrawer()} />
    </View>
  );
}

export default inject('RegisteredSniffersStore')(observer(Sensores));
