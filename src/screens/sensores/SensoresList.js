import { View, Button, Dimensions, Text } from "react-native";
import { observer, inject } from 'mobx-react';
import { StyleSheet } from "react-native";
import { ChartCardsList } from '../../charts/ChartCardsList';


function SensoresList({ RegisteredSniffersStore }) {
    const { getAllportChartForChartCardsList } = RegisteredSniffersStore;

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
        ButtonAndScrollView: { marginHorizontal: horizontalScrollViewMargin, marginTop: 24 },
        Button: {},
        ScrollView: { marginHorizontal: horizontalScrollViewMargin, marginTop: 8 },
        Canvas: { height: yAxisDimensions.height, width: canvasWidth },
        LastCanvas: { height: yAxisDimensions.height, width: canvasWidth, marginBottom: 110 }
    });
    return (
        <View style={styles.ButtonAndScrollView}>
            <ChartCardsList sensorConfigsArray={getAllportChartForChartCardsList()} />
        </View>
    );
}

export default inject('RegisteredSniffersStore')(observer(SensoresList));
