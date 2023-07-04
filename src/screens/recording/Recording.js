import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { ScreenBase } from "../common/ScreenBase";
import SensoresList from "../../screens/sensores/SensoresList.js";
import { observer, inject } from "mobx-react";
import DbOperations from "../../database/DbOperations";


const minutes = 30; // base em minutos
const timeLimit = 60 * minutes; // base em 60 segundos = 1 min
const seconds32 = 32 * 1000; // base em milisegundos = 1000 -> 32 segundos
const timeLimitTimeout = (60000 * minutes) - seconds32; // (60000 = 1 minuto * minutes) - 32 segundos

let thread = null;
let timeoutEvent = null;

const TimerDisplay = () => {
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    thread = setInterval(() => {
      setTimer((timer) => {
        if (timer > 0) return timer - 1;
        else {
          return timer;
        }
      });
    }, 1000);
  }, []);

  return (
    <View style={styles.timerBackground}>
      <Text style={styles.timer}>{timer}</Text>
    </View>
  );
}

function Recording({ navigation, RegisteredSniffersStore }) {
  const {
    startLogs,
    stopLogs,
    getExecutionInfo,
  } = RegisteredSniffersStore;

  const [timeOutComponent, setTimeOutComponent] = useState(null);

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
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");

      await DbOperations.removeAllTempExecutions();
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
      quality: "480p",
      maxDuration: timeLimit, // 60 segundos * 30 = 30 min, 30 minuto funciona bem
      mute: false,
    };

    cameraRef.current.recordAsync(options).then((recordedVideo) => {
      // this is called when stopRecording(), maxDuration o maxFileSize is reached
      stopLogs();
      setVideo(recordedVideo);
      setIsRecording(false);
      // navigation.navigate('execution-preview', {video: recordedVideo, execution});
    });

    timeoutEvent = setTimeout(() => {
      setTimeOutComponent(<TimerDisplay />);
    }, timeLimitTimeout);
  };

  if (video) {
    clearInterval(thread);
    thread = null;
    clearTimeout(timeoutEvent);
    timeoutEvent = null;
    // setTimeOutComponent(null);
    const execution = getExecutionInfo();
    execution['videoAsset'] = { uri: video.uri };
    /* const execution = {
      executionId: 2,
      sniffers: [
        {
          wsClientUrl: "ws://192.168.1.199:81",
          id: 2,
          portIds: [
            { id: 3, portName: "port1" },
            { id: 4, portName: "port2" },
          ],
        },
      ],
      videoAsset: {
        "mediaType": "video",
        "modificationTime": 1686517909000,
        "uri": "file:///storage/emulated/0/DCIM/1e37dd68-3a55-462e-9a66-7d2c7dcc77d2.mp4",
        "filename": "1e37dd68-3a55-462e-9a66-7d2c7dcc77d2.mp4",
        "width": 1080,
        "id": "1000010523",
        "creationTime": 1686517904000,
        "albumId": "-2075821635",
        "height": 1920,
        "duration": 7.783
      },
    }; */

    navigation.navigate('execution-preview', { execution: execution });
  }

  return (
    <View style={styles.returnView}>
      <View style={styles.viewContainer}>
        <Camera style={styles.cameraContainer} ref={cameraRef} >
          <Button
            title={isRecording ? "Stop Recording" : "Record Video"}
            onPress={isRecording ? () => { cameraRef.current.stopRecording(); } : recordVideo}
          />
          {timeOutComponent}
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
  timer: {
    fontSize: 18,
    color: 'white',
  },
  timerBackground: {
    width: 40,
    height: 40,
    borderRadius: 20, // Half the width and height to create a circle
    backgroundColor: '#3B3B3B',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 4,
    bottom: 4,
  }
});

export default inject("RegisteredSniffersStore")(observer(Recording));
