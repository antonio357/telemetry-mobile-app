import { Text, View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import DbOperations from "../../database/DbOperations";
import { ScreenBase } from "../common/ScreenBase";
import ExecutionPlayer from "../../player/ExecutionPlayer";

export default function ExecutionScreen({ route, navigation }) {
    const { executionId } = route.params;
    const [execution, setExecution] = useState(null);

    useEffect(() => {
        (async () => {
            if (executionId && typeof executionId === 'number') {
                const auxExecution = await DbOperations.findExecution(executionId);
                auxExecution.executionId = auxExecution.id;
                setExecution(auxExecution);
            }
        })();
    }, [executionId]);

    let screen = <></>;
    if (executionId && typeof executionId === 'number') {
        if (execution) {
            screen = <ExecutionPlayer execution={execution} />;
        } else {
            screen = <Text>Could not find an execution from id {executionId}</Text>;
        }
    } else {
        screen = <Text>{executionId} is not a valid execution id</Text>;
    }

    return (
        <>
            {screen}
            <ScreenBase openRoutesMenu={() => navigation.openDrawer()} />
        </>
    );
}

const styles = StyleSheet.create({
    returnView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});