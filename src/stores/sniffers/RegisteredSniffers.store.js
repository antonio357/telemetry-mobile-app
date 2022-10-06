import { action, makeObservable, observable } from 'mobx';
import WsClient from '../../components/socket/WsClient';
import { Skia } from "@shopify/react-native-skia";


class LineChart {
  constructor(xScale, yScale) {
    this.xScale = {
      min: xScale[0],
      max: xScale[1],
    }
    this.yScale = {
      min: yScale[0],
      max: yScale[1],
    }
    this.path = Skia.Path.Make();
    this.pathStatus = {
      moved: false,
    }
    this.lastXAxisIndex = 0;
    this.axisScale = {
      x: 5,
      y: 1,
    };
  }

  pushData = data => {
    const limit = 50;
    let tmpComands = this.path.toCmds();
    if (tmpComands.length > 0) {
      if (tmpComands.length < limit) {
        this.path.lineTo(this.lastXAxisIndex * this.axisScale.x, data * this.axisScale.y);
      } else {
        this.lastXAxisIndex -= 1;
        for (let i = tmpComands.length - 1; i > 0; i--) {
          tmpComands[i][1] = tmpComands[i - 1][1];
        }
        this.path.rewind();
        this.path.moveTo(tmpComands[1][1], tmpComands[1][2]);
        for (let i = 2; i < tmpComands.length; i++) {
          this.path.lineTo(tmpComands[i][1], tmpComands[i][2]);
        }
        this.path.lineTo(this.lastXAxisIndex * this.axisScale.x, data * this.axisScale.y);
      }
    }
    else {
      this.path.moveTo(this.lastXAxisIndex * this.axisScale.x, data * this.axisScale.y);
    }
    this.lastXAxisIndex += 1;
  }

  loadDataVector = vector => {
    for (let i = 0; i < vector.length; i++) {
      // console.log(`vector[${i}] = ${vector[i]}`);
      this.pushData(vector[i])
    }
  }

  getPath = () => {
    return this.path;
  }
}

class RegisteredSniffersStore {
  // register last command sent to all wsClients
  lastCmdToAllWsClients = "stop logs";

  // wsClient connections
  wsClients = [];
  loadLogsThread = null;

  // observables for sniffers screens
  registeredSniffers = [];

  // for logs screen
  presentLogs = {};
  presentLogsBuffer = {};
  presentLogsBufferThread = null

  // path to the port and sensortype
  // example:
  // portChart = [
  //   {
  //     url: 'ws://192.168.1.199:81',
  //     port: 'port1',
  //     chart: new LineChart([0, 100], [0, 255]),
  //   },
  //   ...
  // ]
  portChart = []

  constructor() {
    makeObservable(this, {
      // observables for sniffers screens
      registeredSniffers: observable,

      // sniffers registration methods
      register: action,

      // wsClient methods
      connect: action,
      disconnect: action,
      updateSnifferStatus: action,

      // ports and sensors
      registerConnectedPorts: action,
      setSensorType: action,

      // logs rendering methods
      presentLogs: observable,
      updateLogs: action,
      addPresentLogs: action,
      clearPresentLogs: action,

      lastCmdToAllWsClients: observable,
      startLogs: action,
      stopLogs: action,
    })

    this.register('pré cadastrado', 'ws://192.168.1.199:81'); // just for testing

    // thread for updating logs to render charts
    // this.presentLogsBufferThread = setInterval(this.updateLogs, 500);

    // thread gets logs from WsClient buffers and pushes them to the charts
    this.loadLogsThread = setInterval(this.getWsClientsBufferedLogs, 0);
  }

  getWsClientsBufferedLogs = () => {
    let logs; 
    let ports;
    for (let i = 0; i < this.wsClients.length; i++) {
      logs = this.wsClients[i].getLogs(100);
      ports = Object.keys(logs);
      for (let j = 0; j < ports.length; j++) {
        this.pushDataPortChart(this.wsClients[i].getUrl(), ports[j], logs[ports[j]]);
      }
    }
  }

  // ports and sensors
  getAllPortChart = () => {
    return this.portChart;
  }
  getPortChart = (wsClientUrl, portName) => {
    // console.log(`getPortChart(${wsClientUrl}, ${portName})`);
    // console.log(`this.portChart = ${JSON.stringify(this.portChart)}`);
    return this.portChart.find(port => port.url == wsClientUrl && port.port == portName)
  }
  // getPortChartPath = (wsClientUrl, portName) => {
  //   const portChartRef = this.getPortChart(wsClientUrl, portName);
  //   if (portChartRef) {
  //     return portChartRef.getPath();
  //   }
  // }
  createChart = () => {
    return new LineChart([0, 100], [0, 255]);
  }
  setPortChart = (wsClientUrl, portName) => {
    const portChartRef = this.getPortChart(wsClientUrl, portName);
    const wsClient = this.getWsClient(wsClientUrl);
    if (portChartRef) {
      portChartRef.chart = this.createChart();
    } else {
      this.portChart.push(
        {
          url: wsClientUrl,
          port: portName,
          chart: this.createChart(),
        }
      );
      wsClient.setLogsBufferPort(portName);
    }
  }
  removePortChart = (wsClientUrl, portName) => {
    const portChartIndex = this.portChart.findIndex(port => port.url == wsClientUrl && port.port == portName);
    const wsClient = this.getWsClient(wsClientUrl);
    if (portChartIndex > -1) {
      this.portChart.splice(portChartIndex, 1);
      wsClient.removeLogsBufferPort(portName);
    }
  }
  pushDataPortChart = (wsClientUrl, portName, dataVector) => {
    const portChartRef = this.getPortChart(wsClientUrl, portName);
    // console.log(`portChartRef = ${JSON.stringify(portChartRef)}`);
    if (portChartRef) {
      portChartRef.chart.loadDataVector(dataVector.map(log => log.value));
    }
  }

  registerConnectedPorts = (url, ports) => {
    const sniffer = this.getRegisteredSniffer(url);
    sniffer.sensors = ports.map(port => { return { sensorType: undefined, portName: port, selectOpen: false } });
  }

  setSensorType = (url, portName, sensorType) => {
    const sniffer = this.getRegisteredSniffer(url);
    const port = sniffer.sensors.find(port => port.portName == portName);
    port.sensorType = sensorType;

    // send information for sniffer
    const socket = this.getWsClient(url);
    if (socket) {
      socket.send(JSON.stringify({
        cmd: 'port config',
        portName: portName,
        sensorType: sensorType
      }));
    }

    // conifigure its sensor chart
    if (sensorType) {
      this.setPortChart(url, portName);
    } else {
      this.removePortChart(url, portName);
    }
  }

  getWsClient = url => {
    return this.wsClients.find(socket => socket.getUrl() == url);
  }

  // logs rendering methods
  updateLogs = () => {
    if (Object.keys(this.presentLogsBuffer).length > 0) {
      Object.keys(this.presentLogsBuffer).forEach(url => {
        if (!this.presentLogs[url]) {
          this.presentLogs[url] = {};
          Object.keys(this.presentLogsBuffer[url]).forEach(port => {
            this.presentLogs[url][port] = [];
          });
        }
        Object.keys(this.presentLogsBuffer[url]).forEach(port => {
          this.presentLogs[url][port] = [...this.presentLogsBuffer[url][port]];
        });
        this.presentLogsUpdatesCounter += 1;
      });
    }
  }

  getLogsInTime = seconds => {
    this.clearPresentLogs();
    this.startLogs();
    setTimeout(() => this.stopLogs(), seconds * 1000);
    this.presentLogsUpdatesCounter = 0;
    this.graphUpdatesCounter = 0;
  }

  addPresentLogs = (url, logs) => {
    if (!this.presentLogsBuffer[url]) {
      this.presentLogsBuffer[url] = {};
      Object.keys(logs[0]).forEach(port => {
        this.presentLogsBuffer[url][port] = [];
      });
    }
    logs.forEach(log => {
      Object.keys(log).forEach(port => {
        if (this.presentLogsBuffer[url][port].length >= 100) this.presentLogsBuffer[url][port].shift();
        this.presentLogsBuffer[url][port].push({ y: log[port], x: this.counter });
      });
      this.counter += 1;
    });
  }

  clearPresentLogs = () => {
    this.presentLogsBuffer = {};
    this.counter = -1;
  }

  // sniffers registration methods
  register = (name, url) => {
    this.registeredSniffers.push({
      name: name,
      url: url,
      status: 'desconectado',
      sensors: [],
    });
    this.wsClients.push(new WsClient(name, url));
  }

  getRegisteredSniffer = url => {
    return this.registeredSniffers.find(sniffer => sniffer.url == url);
  }

  // wsClient methods
  connect = url => {
    const wsClient = this.wsClients.filter(socket => socket.url == url)[0];
    if (wsClient) wsClient.connect();
  }

  disconnect = url => {
    const wsClient = this.wsClients.filter(socket => socket.url == url)[0];
    if (wsClient) wsClient.disconnect();
  }

  updateSnifferStatus = (url, status) => {
    const sniffer = this.registeredSniffers.filter(sniffer => sniffer.url == url)[0];
    if (sniffer) sniffer.status = status;
  }

  startLogs = () => {
    this.lastCmdToAllWsClients = "start logs";
    this.wsClients.forEach(socket => socket.send('start logs'));
  }

  stopLogs = () => {
    this.lastCmdToAllWsClients = "stop logs";
    this.wsClients.forEach(socket => socket.send('stop logs'));
  }
}

export default new RegisteredSniffersStore();
