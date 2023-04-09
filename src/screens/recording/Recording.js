import { StyleSheet, Text, View, Button, SafeAreaView, ScrollView } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import { ScreenBase } from "../common/ScreenBase";
import SensoresList from '../../screens/sensores/SensoresList.js';
import { observer, inject } from 'mobx-react';

function Recording({ navigation, RegisteredSniffersStore }) {
  const { startLogs, stopLogs } = RegisteredSniffersStore;

  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();

      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMicrophonePermission(microphonePermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined || hasMicrophonePermission === undefined) {
    return <Text>Requestion permissions...</Text>
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted.</Text>
  }

  let recordVideo = () => {
    startLogs();
    setIsRecording(true);
    let options = {
      quality: "1080p",
      maxDuration: 60,
      mute: false
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
    let saveVideo = () => {
      MediaLibrary.saveToLibraryAsync(video.uri).then(() => {
        setVideo(undefined);
      });
    };

    return (
      <View style={styles.videoContainer}>
        <View style={styles.viewContainer}>
          <Video
            style={styles.video}
            source={{ uri: video.uri }}
            useNativeControls
            onPlaybackStatusUpdate={obj => {
              const {isPlaying, durationMillis, positionMillis} = obj;
              // console.log(`onPlaybackStatusUpdate obj = ${JSON.stringify(obj)}`);
            }}
          />
        </View>
        <View style={styles.videoButtonsView}>
          <View style={{ flexDirection: 'row' }}>
            {hasMediaLibraryPermission ? <Button title="Save" onPress={saveVideo} /> : undefined}
            <Button title="Discard" onPress={() => setVideo(undefined)} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.returnView}>
      <View style={styles.viewContainer}>
        <Camera style={styles.cameraContainer} ref={cameraRef}>
          <Button title={isRecording ? "Stop Recording" : "Record Video"} onPress={isRecording ? stopRecording : recordVideo} />
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
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 5
  },
  videoContainer: {
    flex: 1,
  },
  videoButtonsView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 5,
  },
  video: {
    flex: 1,
  },
  returnView: {
    flex: 1,
  }
});

export default inject('RegisteredSniffersStore')(observer(Recording));