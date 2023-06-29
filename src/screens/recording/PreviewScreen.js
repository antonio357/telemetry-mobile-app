import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import DbOperations from "../../database/DbOperations";
import { ScreenBase } from "../common/ScreenBase";
import ExecutionPlayer from "../../player/ExecutionPlayer";
import * as MediaLibrary from "expo-media-library";
import { observer, inject } from "mobx-react";

function PreviewScreen({ route, navigation, RegisteredSniffersStore }) {
    const {
        setExecutionVideo,
    } = RegisteredSniffersStore;
    const { execution } = route.params;
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();

    const saveExecution = async (videoUri) => {
        const asset = await MediaLibrary.createAssetAsync(videoUri);
        setExecutionVideo(asset); // continue here, this needs registeredsnifferstore
    };

    useEffect(() => {
        (async () => {
            const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
            console.log(`mediaLibraryPermission = ${JSON.stringify(mediaLibraryPermission)}`);
            setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
        })()
    }, [execution]);

    let screen = <></>;
    if (execution?.videoAsset?.uri) {
        screen =
            <>
                <ExecutionPlayer execution={execution} />
                {hasMediaLibraryPermission ? (
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={() => {
                            saveExecution(execution.videoAsset.uri);
                            navigation.navigate('gravar');
                        }}
                    >
                        <Text style={{ color: "white" }}>SAVE</Text>
                    </TouchableOpacity>
                ) : undefined}
                <TouchableOpacity
                    style={styles.discardButton}
                    onPress={() => navigation.navigate('gravar')}
                >
                    <Text style={{ color: "white" }}>DISCARD</Text>
                </TouchableOpacity>
                {/* <ScreenBase openRoutesMenu={() => navigation.openDrawer()} /> */}
            </>;
    } else {
        screen =
            <View style={styles.errorText}>
                <Text>Could not find the execution video from uri {execution?.videAsset?.uri}</Text>
            </View>;
    }

    return (
        <>
            {screen}
            <ScreenBase openRoutesMenu={() => navigation.openDrawer()} />
        </>
    );
}

const styles = StyleSheet.create({
    errorText: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButton: {
        position: "absolute",
        width: 45,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        left: 100,
        bottom: 10,
        backgroundColor: "#1299FA",
        borderRadius: 2,
    },
    discardButton: {
        position: "absolute",
        width: 70,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        left: 180,
        bottom: 10,
        backgroundColor: "#1299FA",
        borderRadius: 2,
    },
});

export default inject("RegisteredSniffersStore")(observer(PreviewScreen));