import { StyleSheet, View, ScrollView, Text, FlatList } from "react-native";
import SensoresList from "../screens/sensores/SensoresList.js";
import { Video, ResizeMode } from "expo-av";

export default function ExecutionPlayer({ execution }) {
  return (
    <>
      <View style={styles.viewContainer}>
        <Video
          style={styles.video}
          source={{ uri: execution.videoUri }}
          useNativeControls
          onPlaybackStatusUpdate={(obj) => {
            const { isPlaying, durationMillis, positionMillis } = obj;
          }}
        />
      </View>
      <ScrollView>
        <SensoresList />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    height: 300,
  },
  video: {
    flex: 1,
  },
});
