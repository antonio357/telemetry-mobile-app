import { Text, View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import DbOperations from "../../database/DbOperations";
import { ScreenBase } from "../common/ScreenBase";

export default function ExecutionScreen({ route, navigation }) {
    const { executionId } = route.params;
    const [execution, setExecution] = useState(null);

    useEffect(() => {
        (async () => {
            if (executionId && typeof executionId === 'number') {
                setExecution(await DbOperations.findExecution(executionId));
            }
        })();
    }, []);

    let screen = <></>;
    if (executionId && typeof executionId === 'number') {
        if (execution) {
            screen = <></>;
        } else {
            screen = <Text>Could not find an execution from id {executionId}</Text>;
        }
    } else {
        screen = <Text>{executionId} is not a valid execution id</Text>;
    }

    return (
        <View style={styles.returnView}>
            {screen}
            <ScreenBase openRoutesMenu={() => navigation.openDrawer()} />
        </View>
    );
}

const styles = StyleSheet.create({
    returnView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});