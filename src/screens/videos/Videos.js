import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Button } from "react-native";
import { ScreenBase } from "../common/ScreenBase";
import { styles as commonStyles } from '../../../App.styles';
import { useEffect, useState } from "react";
import DbOperations from "../../database/DbOperations";
import * as VideoThumbnails from 'expo-video-thumbnails';
// import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

function Execution({ name, initDate, videoUri }) {
  // const navigation = useNavigation(); 
  // 'file:///data/user/0/host.exp.exponent/cache/VideoThumbnails/360d3210-cc28-4fbd-a457-b6188c6bd21e.jpg'
  const [thumbnailImageUri, setThumbnailImageUri] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri);
        setThumbnailImageUri(uri);
      } catch (e) {
        console.warn(e);
      }
    })();
  }, []);

  return (
    <TouchableOpacity style={styles.execution} onPress={() => {
      // navigation.navigate('execution-player');
    }}>
      {thumbnailImageUri ? <>
        <Image source={{ uri: thumbnailImageUri }} style={styles.thumbnail} />
        <TouchableOpacity style={styles.executionMenu}>
          <MaterialIcons name="menu" size={20} color={'black'} />
        </TouchableOpacity>
      </> : <Text>no thumbnail avaliable</Text>}
    </TouchableOpacity>
  );
}


export default function Videos({ navigation }) {
  /* allExecutions = [{"id":2,"name":"temporary name","initDate":"2023-5-1","initTime":"20:40:16:483","endTime":"",
  "videoUri":"file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Ftelemetry-mobile-app-7b0b405f-9f51-43ee-8c03-7c233789326a/Camera/aad3124b-ffdf-4dfb-873a-95e32a3077c6.mp4"}]*/
  const [allExecutions, setAllExecutions] = useState([]);

  useEffect(() => {
    (async () => {
      const executions = await DbOperations.getAllExecutions();
      setAllExecutions(executions);
    })();
  }, []);



  return (
    <View style={styles.view}>
      {allExecutions.length > 0 ?
        //<View style={styles.view}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.scrollViewInternalViewToPutItensSideBySide}>
            {allExecutions.map(execution => <Execution {...execution} key={execution.id} />)}
          </View>
        </ScrollView>
        //</View>
        : <Text>no executions found</Text>}
      <ScreenBase openRoutesMenu={() => navigation.openDrawer()} />
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    margin: 30,
  },
  scrollView: {},
  scrollViewInternalViewToPutItensSideBySide: { flex: 1, flexDirection: 'row' },
  execution: {},
  thumbnail: { width: 150, height: 150 },
  executionMenu: {
    position: "absolute",
    right: 7,
    top: 7,
    width: 30,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  }
}); 