import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { Camera } from "expo-camera";
import { Video } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import { ScreenBase } from "../common/ScreenBase";
import SensoresList from "../../screens/sensores/SensoresList.js";
import { observer, inject } from "mobx-react";
import DbOperations from "../../database/DbOperations";
import ExecutionPlayer from "../../player/ExecutionPlayer";

function Recording({ navigation, RegisteredSniffersStore }) {
  const {
    startLogs,
    stopLogs,
    setExecutionVideo,
    getExecutionInfo,
  } = RegisteredSniffersStore;

  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission =
        await Camera.requestMicrophonePermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();

      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMicrophonePermission(microphonePermission.status === "granted");
      // console.log(`mediaLibraryPermission = ${JSON.stringify(mediaLibraryPermission)}`);
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");

      await DbOperations.removeAllTempExecutions();
      // console.log(`conferindo permissoes de mídia ${JSON.stringify(MediaLibrary.getPermissionsAsync())}`);
    })();
  }, []);

  if (
    hasCameraPermission === undefined ||
    hasMicrophonePermission === undefined
  ) {
    return <Text>Requestion permissions...</Text>;
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted.</Text>;
  }

  let recordVideo = () => {
    startLogs();
    setIsRecording(true);
    let options = {
      quality: "1080p",
      maxDuration: 60,
      mute: false,
    };

    cameraRef.current.recordAsync(options).then((recordedVideo) => {
      setVideo(recordedVideo);
      setIsRecording(false);
    });
  };

  let stopRecording = () => {
    setIsRecording(false);
    cameraRef.current.stopRecording();
    stopLogs();
  };

  if (video) {
    const execution = getExecutionInfo();
    execution['videoUri'] = video.uri;
    // const execution = {
    //   executionId: 2,
    //   sniffers: [
    //     {
    //       wsClientUrl: "ws://192.168.1.199:81",
    //       id: 2,
    //       portIds: [
    //         { id: 3, portName: "port1" },
    //         { id: 4, portName: "port2" },
    //       ],
    //     },
    //   ],
    //   videoUri:
    //     "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540antonio357%252Ftelemetry-mobile-app/Camera/c75c2da9-b610-4377-9992-26511ad019f8.mp4",
    // };

    let saveVideo = () => {
      MediaLibrary.saveToLibraryAsync(video.uri).then(() => {
        setExecutionVideo(video.uri);
        setVideo(undefined);
      });
    };

    return (
      <>
        <ExecutionPlayer execution={execution} />
        {hasMediaLibraryPermission ? (
          <TouchableOpacity
            style={{
              position: "absolute",
              width: 45,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              left: 100,
              bottom: 10,
              backgroundColor: "#1299FA",
              borderRadius: 2,
            }}
            onPress={saveVideo}
          >
            <Text style={{ color: "white" }}>SAVE</Text>
          </TouchableOpacity>
        ) : undefined}
        <TouchableOpacity
          style={{
            position: "absolute",
            width: 70,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            left: 180,
            bottom: 10,
            backgroundColor: "#1299FA",
            borderRadius: 2,
          }}
          onPress={() => setVideo(undefined)}
        >
          <Text style={{ color: "white" }}>DISCARD</Text>
        </TouchableOpacity>
        <ScreenBase openRoutesMenu={() => navigation.openDrawer()} />
      </>
    );
  }

  return (
    <View style={styles.returnView}>
      <View style={styles.viewContainer}>
        <Camera style={styles.cameraContainer} ref={cameraRef}>
          <Button
            title={isRecording ? "Stop Recording" : "Record Video"}
            onPress={isRecording ? stopRecording : recordVideo}
          />
        </Camera>
      </View>
      <ScrollView>
        <SensoresList />
      </ScrollView>
      <ScreenBase openRoutesMenu={() => navigation.openDrawer()} />
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    height: 300,
  },
  cameraContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 5,
  },
  videoContainer: {
    flex: 1,
  },
  videoButtonsView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 5,
  },
  video: {
    flex: 1,
  },
  returnView: {
    flex: 1,
  },
});

export default inject("RegisteredSniffersStore")(observer(Recording));
