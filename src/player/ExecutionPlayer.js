import { StyleSheet, View, ScrollView } from "react-native";
import DbOperations from "../database/DbOperations.js";
import { useEffect, useState } from "react";
import { ChartCardsList } from "../charts/ChartCardsList.js";
import { Skia } from "@shopify/react-native-skia";
import { CanvasDimensions } from "../charts/CanvasDimensions.js";
import { VideoPlayer } from './index.tsx';
// import { ResizeMode } from 'expo-av';


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
    this.lasPositionCall = null;
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
    if (timelinePosition == this.lasPositionCall) return;

    this.lasPositionCall = timelinePosition;
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

  playerIsRunning = timelinePosition => {

  }
}

export default function ExecutionPlayer({ execution }) {
  const [executionConfig, setExecutionConfig] = useState({});
  const [portsConfig, setPortsConfig] = useState({});

  useEffect(() => {
    (async () => {
      DbOperations.findExecutionInfo(execution.executionId).then(executionConfig => {
        setExecutionConfig(executionConfig);
        // executionConfig = { 
        //   "id": 2, 
        //   "name": "new name inserted by user", 
        //   "initDate": "2023-4-10", 
        //   "initTime": "17:59:33:793", 
        //   "endTime": "18:0:6:127", 
        //   "videoUri": "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540antonio357%252Ftelemetry-mobile-app/Camera/c75c2da9-b610-4377-9992-26511ad019f8.mp4", 
        //   "sniffers": [{ 
        //     "id": 2, 
        //     "name": "ws://192.168.1.199:81", 
        //     "wsClientUrl": "ws://192.168.1.199:81", 
        //     "ports": [{ 
        //       "id": 3, 
        //       "name": "port1", 
        //       "sensorName": "sensor de distância", 
        //       "sensorType": "ultrassonic" 
        //     }, { 
        //       "id": 4, 
        //       "name": "port2", 
        //       "sensorName": "sensor de distância", 
        //       "sensorType": "ultrassonic" 
        //     }] 
        //   }] 
        // }
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
  }, [])

  if (Object.values(executionConfig).length == 0) return <></>;

  return (
    <>
      <VideoPlayer
        style={styles.video}
        videoProps={{
          source: {
            // resizeMode: ResizeMode.CONTAIN,
            uri: execution.videoUri,
          },
        }}
        playbackCallback={obj => {
          // const obj =  {"isMuted":false,"isBuffering":false,"audioPan":0,"uri":"/data/user/0/host.exp.exponent/cache/ExperienceData/%40antonio357%2Ftelemetry-mobile-app/Camera/c7b797b4-f741-4898-9a8b-738a248c840a.mp4","shouldPlay":false,"durationMillis":5461,"isLoaded":true,"didJustFinish":false,"androidImplementation":"SimpleExoPlayer","isLooping":false,"progressUpdateIntervalMillis":500,"volume":1,"playableDurationMillis":5461,"shouldCorrectPitch":false,"isPlaying":false,"rate":1,"positionMillis":5461}
          const { isPlaying, positionMillis } = obj;
          console.log(`playbackCallback {isPlaying: ${isPlaying}, positionMillis: ${positionMillis}} `);
          if (isPlaying) {

          } else {
            const keys = Object.keys(portsConfig);
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
