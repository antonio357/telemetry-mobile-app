import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';


// tentativa 1 https://www.youtube.com/watch?v=4VFYqw5h_qs não funcionou

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1
  },
  video: {
    alignSelf: 'center',
    width: 350,
    height: 220
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

function Recording({ navigation, RegisteredSniffersStore }) {
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [record, setRecord] = useState(null);
  const [type, setType] = useState(null);
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});


  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const audioStatus = await Camera.requestMicrophonePermissionsAsync();
      setHasAudioPermission(audioStatus.status === 'granted');
    })();
  }, [])

  const takeVideo = async () => {
    console.log(`takeVideo camera = $camera}`);
    if (camera) {
      const data = await camera.recordAsync({ maxDuration: 10 });
      setRecord(data.uri);
      console.log(`takeVideo data.uri = ${data.uri}`);
    }
  }

  const stopVideo = async () => {
    console.log(`stopVideo camera = $camera}`);
    camera.stopRecording();
  }

  if (hasCameraPermission === null || hasAudioPermission === null) return <View></View>;
  if (hasCameraPermission === false || hasAudioPermission === false) return <Text>No access to camera</Text>

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={ref => setCamera(ref)}
          styles={styles.fixedRatio}
          type={'back'}
          ratio={'4:3'}
        />
      </View>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: record
        }}
        useNativeControls
        resizeMode="contain"
        isLooping
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
      <View>
        <Button
          title={status.isPlaying ? 'Pause' : 'Play'}
          onPress={() => status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()}
        />
      </View>
      <Button
        title="Flip Video"
        onPress={() => {
          setType(
            type === camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back
          )
        }}
      />
      <Button title="Take Video" onPress={() => takeVideo()} />
      <Button title="Stop Video" onPress={() => stopVideo()} />
    </View>
  );
}

export default Recording;