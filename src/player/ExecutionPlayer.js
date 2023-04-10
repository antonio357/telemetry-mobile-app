import { StyleSheet, View } from 'react-native';
import { Video } from 'expo-av';


export default function ExecutionPlayer({ execution }) {
    console.log(`ExecutionPlayer = ${JSON.stringify(execution)}`);
    return (
        <View style={styles.viewContainer}>
            <Video
                style={styles.video}
                source={{ uri: execution.videoUri }}
                useNativeControls
                onPlaybackStatusUpdate={obj => {
                    const { isPlaying, durationMillis, positionMillis } = obj;
                }}
            />
        </View>
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