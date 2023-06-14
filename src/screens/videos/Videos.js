import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ScreenBase } from "../common/ScreenBase";
import { useEffect, useState } from "react";
import DbOperations from "../../database/DbOperations";
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';


async function deleteAsset(videoAsset) {
  try {
    // Request permission to access the media library
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status === 'granted') {
      await MediaLibrary.deleteAssetsAsync([videoAsset]);
      console.log('Assets deleted successfully.');
    } else {
      console.log('Permission to access the media library was not granted.');
    }
  } catch (error) {
    console.log('An error occurred while deleting assets:', error);
  }
}

function Line() {
  return (
    <View style={{
      borderBottomColor: 'black',
      borderBottomWidth: 0.5,
      width: 70,
      marginBottom: 2
    }} />
  )
}

function ExecutionMenu({ executionId, videoAsset, removeExecution }) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  return (
    <>
      {menuIsOpen ?
        <View style={styles.executionMenuOptionsList}>
          <TouchableOpacity style={styles.executionMenuOptionItem} onPress={() => {
            DbOperations.removeExecution(executionId);
            removeExecution(executionId);
            deleteAsset(videoAsset);
          }}>
            <Text>DELETAR</Text>
          </TouchableOpacity>
          <Line />
          <TouchableOpacity style={styles.executionMenuOptionItem} onPress={() => setMenuIsOpen(false)}>
            <AntDesign name="closecircleo" size={20} color={'black'} />
          </TouchableOpacity>
        </View> :
        <TouchableOpacity style={styles.executionMenu} onPress={() => setMenuIsOpen(true)}>
          <MaterialIcons name="menu" size={20} color={'black'} />
        </TouchableOpacity>}
    </>
  );
}

function Execution({ id, name, initDate, videoAsset, removeExecution }) {
  const navigation = useNavigation();
  // 'file:///storage/emulated/0/DCIM/1e37dd68-3a55-462e-9a66-7d2c7dcc77d2.mp4'
  const [thumbnailImageUri, setThumbnailImageUri] = useState('');

  useEffect(() => {
    (async () => {
      if (videoAsset?.uri) {
        try {
          const { uri } = await VideoThumbnails.getThumbnailAsync(videoAsset?.uri);
          setThumbnailImageUri(uri);
        } catch (e) {
          console.warn(e);
        }
      }
    })();
  }, []);

  return (
    <TouchableOpacity style={styles.execution} onPress={() => {
      navigation.navigate('execution-player', { executionId: id });
    }}>
      <View style={styles.noThumbnailView}>
        {thumbnailImageUri ? <Image source={{ uri: thumbnailImageUri }} style={styles.thumbnail} /> : <Text>no thumbnail avaliable</Text>}
        <ExecutionMenu executionId={id} removeExecution={removeExecution} videoAsset={videoAsset} />
      </View>
    </TouchableOpacity>
  );
}


export default function Videos({ navigation }) {
  /* allExecutions = [{
      "id":2,
      "name":"temporary name",
      "initDate":"2023-5-1",
      "initTime":"20:40:16:483",
      "endTime":"",
      "videoAsset":{
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
      }
    }]*/
  const [allExecutions, setAllExecutions] = useState([]);
  const removeExecution = executionId => {
    setAllExecutions(allExecutions.filter(execution => execution.id != executionId));
  }

  useEffect(() => {
    (async () => {
      const executions = await DbOperations.getAllExecutions();
      setAllExecutions(executions);
    })();
  }, []);

  return (
    <View style={styles.view}>
      {allExecutions.length > 0 ?
        <ScrollView style={styles.scrollView}>
          <View style={styles.scrollViewInternalViewToPutItensSideBySide}>
            {allExecutions.map(execution => {
              console.log(`execution = ${JSON.stringify(execution)}`);
              return <Execution {...execution} removeExecution={removeExecution} key={execution.id} />;
            })}
          </View>
        </ScrollView>
        : <Text>no executions found</Text>}
      <ScreenBase openRoutesMenu={() => navigation.openDrawer()} />
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {},
  scrollViewInternalViewToPutItensSideBySide: { flex: 1, flexDirection: "row", flexWrap: "wrap" },
  execution: { width: 150, height: 150, marginBottom: 10, marginLeft: 10 },
  thumbnail: { width: '100%', height: 150, borderRadius: 10 },
  noThumbnailView: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#d9d9d9',
    shadowOpacity: 0.8,
    borderRadius: 10,
  },
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
  },
  executionMenuOptionsList: {
    position: "absolute",
    right: 7,
    top: 7,
    width: 80,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  executionMenuOptionItem: { height: 22 },
}); 