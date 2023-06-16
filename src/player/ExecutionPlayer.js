import { StyleSheet, View, ScrollView } from "react-native";
import DbOperations from "../database/DbOperations.js";
import { useEffect, useState } from "react";
import { ChartCardsList } from "../charts/ChartCardsList.js";
import { Skia } from "@shopify/react-native-skia";
import { CanvasDimensions } from "../charts/CanvasDimensions.js";
import { VideoPlayer } from './index.tsx';
import { ResizeMode } from 'expo-av';


class DbLogsChart {
  constructor(portId, timeFrame = 10, logsRate = 1000) {
    this.path = Skia.Path.Make();
    this.path.setIsVolatile(false);

    this.xBounds = { min: 0, max: timeFrame * logsRate };
    this.yBounds = { min: 0, max: 2550 };
    this.lineDrawPoints = new CanvasDimensions().lineDrawPoints;
    this.axisLength = { x: this.lineDrawPoints.rightBottom.x - this.lineDrawPoints.leftBottom.x, y: this.lineDrawPoints.rightTop.y - this.lineDrawPoints.rightBottom.y };
    this.dimensionsUnits = { x: this.axisLength.x / this.xBounds.max, y: this.axisLength.y / this.yBounds.max };
    this.lastPointTime = 0;

    this.queryPort = portId;
    this.queryBufferLimit = 30000;
    this.queryBuffer = [];
    this.queryBufferWindowIndexes = { begin: -1, end: -1 }
    this.playerStoppedLastCallTimeline = -1;
    this.playerIsRunningLastCallTimeline = -1;
  }

  getPath = () => {
    return this.path;
  }

  pushData = data => {
    const y = ((this.yBounds.max - parseInt(data.value)) * this.dimensionsUnits.y);
    const timeDiff = (data.time - this.lastPointTime) * this.dimensionsUnits.x;
    const x = (this.path.getLastPt().x + timeDiff);
    this.path.lineTo(x, y);
    if (this.path.getLastPt().x > this.lineDrawPoints.rightBottom.x) {
      const pathLen = Math.abs(this.path.getPoint(0).x - this.path.getLastPt().x);
      const trim = (pathLen - this.axisLength.x) / pathLen;
      if (trim >= 0.25) {
        this.path.trim(trim, 1, false);
      }
      const offSet = this.path.getLastPt().x - this.lineDrawPoints.rightBottom.x;
      this.path.offset(- offSet, 0);
    }

    this.lastPointTime = data.time;
  }

  loadWindow = () => {
    const data = this.queryBuffer[this.queryBufferWindowIndexes.begin];
    const y = ((this.yBounds.max - parseInt(data.value)) * this.dimensionsUnits.y);
    const x = (data.time - this.lastPointTime) * this.dimensionsUnits.x;
    this.path.moveTo(x, y);
    this.lastPointTime = data.time;
    for (let i = this.queryBufferWindowIndexes.begin + 1; i < this.queryBufferWindowIndexes.end + 1; i++) {
      this.pushData(this.queryBuffer[i]);
    }
  }

  playerStopped = async timelinePosition => {
    this.playerIsRunningLastCallTimeline = -1;
    if (timelinePosition == this.playerStoppedLastCallTimeline) return;

    this.playerStoppedLastCallTimeline = timelinePosition;
    this.queryBuffer = await DbOperations.findLogsByPort(this.queryPort, timelinePosition);
    // console.log(`timelinePosition = ${timelinePosition}`);
    // console.log(`this.queryBuffer.length = ${this.queryBuffer.length}`);
    // console.log(`[this.queryBuffer[0], this.queryBuffer[-1]] = ${[JSON.stringify(this.queryBuffer[0]), JSON.stringify(this.queryBuffer[this.queryBuffer.length - 1])]}`);

    this.path.rewind();
    this.lastPointTime = 0;

    let begin = timelinePosition - 5000;
    let end = timelinePosition + 5000;
    if (begin < 0) {
      end += begin * -1;
      begin = 0;
    }

    this.queryBufferWindowIndexes = { begin: 0, end: this.queryBuffer.length - 1 };
    for (let i = 0; i < this.queryBuffer.length; i++) {
      if (this.queryBuffer[i].time >= begin) {
        this.queryBufferWindowIndexes.begin = i;
        break;
      }
    }
    for (let i = this.queryBuffer.length - 1; i > -1; i--) {
      if (this.queryBuffer[i].time <= end) {
        this.queryBufferWindowIndexes.end = i;
        break;
      }
    }

    this.loadWindow();
  }

  buffer = async () => {
    const lastBufferDataTime = this.queryBuffer[this.queryBuffer.length - 1].time;
    const newDataBuffer = await DbOperations.findLogsByPortAndInterval(this.queryPort, { begin: lastBufferDataTime, end: lastBufferDataTime + 13000 }, 15000);
    const diff = Math.abs(this.queryBufferLimit - (this.queryBuffer.length + newDataBuffer.length));
    this.queryBuffer = [...this.queryBuffer.slice(diff), ...newDataBuffer];
    this.queryBufferWindowIndexes.end -= diff;
    if (this.queryBufferWindowIndexes.end < 0) this.queryBufferWindowIndexes.end = 0;
  }

  playerIsRunning = timelinePosition => {
    if (this.playerIsRunningLastCallTimeline > -1) {
      const timePassed = timelinePosition - this.playerIsRunningLastCallTimeline;
      const previousLastIndex = this.queryBufferWindowIndexes.end;
      let newLastIndex = this.queryBufferWindowIndexes.end;
      for (let i = this.queryBufferWindowIndexes.end; i < this.queryBuffer.length; i++) {
        if (this.queryBuffer[i].time - this.queryBuffer[previousLastIndex].time >= timePassed) {
          newLastIndex = i;
          break;
        }
      }
      this.queryBufferWindowIndexes.end = newLastIndex;
      for (let j = previousLastIndex + 1; j < newLastIndex + 1; j++) {
        this.pushData(this.queryBuffer[j]);
      }
    }
    this.playerIsRunningLastCallTimeline = timelinePosition;

    const timeLeftOnBuffer = this.queryBuffer[this.queryBuffer.length - 1].time - this.queryBuffer[this.queryBufferWindowIndexes.end].time;
    if (timeLeftOnBuffer <= 3000) {
      this.buffer();
    }
  }
}

export default function ExecutionPlayer({ execution }) {
  const [executionConfig, setExecutionConfig] = useState({});
  const [portsConfig, setPortsConfig] = useState({});

  useEffect(() => {
    (async () => {
      DbOperations.findExecutionInfo(execution.executionId).then(executionConfig => {
        setExecutionConfig(executionConfig);
        /* executionConfig = { 
          "id": 2, 
          "name": "new name inserted by user", 
          "initDate": "2023-4-10", 
          "initTime": "17:59:33:793", 
          "endTime": "18:0:6:127", 
          "videoAsset": {
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
          "sniffers": [{ 
            "id": 2, 
            "name": "ws://192.168.1.199:81", 
            "wsClientUrl": "ws://192.168.1.199:81", 
            "ports": [{ 
              "id": 3, 
              "name": "port1", 
              "sensorName": "sensor de distância", 
              "sensorType": "ultrassonic" 
            }, { 
              "id": 4, 
              "name": "port2", 
              "sensorName": "sensor de distância", 
              "sensorType": "ultrassonic" 
            }] 
          }] 
        } */
        const ptsConfig = {};
        const sniffers = executionConfig.sniffers;
        for (let i = 0; i < sniffers.length; i++) {
          const sniffer = sniffers[i];
          for (let j = 0; j < sniffer.ports.length; j++) {
            const port = sniffer.ports[j];
            const chart = new DbLogsChart(`${port.id}`);
            ptsConfig[`${port.id}`] = {
              sensorName: port.sensorName,
              sensorType: port.sensorType,
              drawPath: chart.getPath(),
              chart: chart
            };
          }
        }
        setPortsConfig(ptsConfig);
      });
    })();
  }, [execution])

  if (Object.values(executionConfig).length == 0) return <></>;

  return (
    <>
      <VideoPlayer
        style={styles.video}
        // progressUpdateIntervalMillis={100}
        videoProps={{
          resizeMode: ResizeMode.STRETCH,
          source: {
            uri: execution.videoAsset.uri,
          },
        }}
        playbackCallback={obj => {
          // const obj =  {"isMuted":false,"isBuffering":false,"audioPan":0,"uri":"/data/user/0/host.exp.exponent/cache/ExperienceData/%40antonio357%2Ftelemetry-mobile-app/Camera/c7b797b4-f741-4898-9a8b-738a248c840a.mp4","shouldPlay":false,"durationMillis":5461,"isLoaded":true,"didJustFinish":false,"androidImplementation":"SimpleExoPlayer","isLooping":false,"progressUpdateIntervalMillis":500,"volume":1,"playableDurationMillis":5461,"shouldCorrectPitch":false,"isPlaying":false,"rate":1,"positionMillis":5461}
          const { isPlaying, positionMillis } = obj;
          const keys = Object.keys(portsConfig);
          // console.log(`playbackCallback {isPlaying: ${isPlaying}, positionMillis: ${positionMillis}} `);
          if (isPlaying) {
            for (let i = 0; i < keys.length; i++) portsConfig[keys[i]].chart.playerIsRunning(positionMillis);
          } else {
            for (let i = 0; i < keys.length; i++) portsConfig[keys[i]].chart.playerStopped(positionMillis);
          }
        }}
      />
      <ScrollView>
        <View style={styles.ButtonAndScrollView}>
          <ChartCardsList sensorConfigsArray={Object.values(portsConfig)} />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  ButtonAndScrollView: { marginHorizontal: 10, marginTop: 24 },
  video: {
    flex: 1,
    height: 300,
  },
});
