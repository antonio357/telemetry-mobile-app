import { action, makeObservable, observable } from 'mobx';
import WsClient from '../../components/socket/WsClient';
import { Skia } from "@shopify/react-native-skia";


const fpsConsts = {
  threadCycleTime: 0,
  threadGetLogs: 1000,
  pathDataLimit: 1000,
};
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
    this.xCmds = []
    this.yCmds = []
  }

  pushData = data => { // a operação this.path.toCmds() gera legs
    if (this.xCmds.length > 0) {
      if (this.xCmds.length < fpsConsts.pathDataLimit) {
        this.xCmds.push(this.lastXAxisIndex * this.axisScale.x);
        this.yCmds.push(data * this.axisScale.y);
        // this.path.lineTo(this.lastXAxisIndex * this.axisScale.x, data * this.axisScale.y);
      } else {
        this.lastXAxisIndex -= 1;
        for (let i = this.xCmds.length - 1; i > 0; i--) {
          this.xCmds[i] = this.xCmds[i - 1];
        }
        this.xCmds.splice(0, 1);
        this.yCmds.splice(0, 1);
        this.xCmds.push(this.lastXAxisIndex * this.axisScale.x);
        this.yCmds.push(data * this.axisScale.y);
        // this.path.rewind();
        // this.path.moveTo(this.xCmds[0], this.yCmds[0]);
        for (let i = 1; i < this.xCmds.length; i++) {
          // this.path.lineTo(this.xCmds[i], this.yCmds[i]);
        }
      }
    }
    else {
      this.xCmds.push(this.lastXAxisIndex * this.axisScale.x);
      this.yCmds.push(data * this.axisScale.y);
      // this.path.moveTo(this.lastXAxisIndex * this.axisScale.x, data * this.axisScale.y);
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

  getPathString = () => {
    let pathString = `M ${this.xCmds[0]} ${this.yCmds[0]}`;
    for (let i = 1; i < this.xCmds.length; i++) {
      pathString += ` L ${this.xCmds[i]} ${this.yCmds[i]}`;
    }
    return pathString;
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

  // {
  //   `${url}${port}`: "M 128 0 L 168 80 L 256 93 L 192 155 L 207 244 L 128 202 L 49 244 L 64 155 L 0 93 L 88 80 L 128 0",
  //   ... 
  // }
  pathStrings = {
    'ws://192.168.1.199:81port1': "",
    'ws://192.168.1.199:81port2': "",
  }

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
      lastCmdToAllWsClients: observable,
      startLogs: action,
      stopLogs: action,

      // here
      pathStrings: observable,
      pushDataPortChart: action,
    })

    this.register('pré cadastrado', 'ws://192.168.1.199:81'); // just for testing

    // thread gets logs from WsClient buffers and pushes them to the charts
    this.loadLogsThread = setInterval(this.getWsClientsBufferedLogs, fpsConsts.threadCycleTime);
  }

  getWsClientsBufferedLogs = () => {
    let logs;
    let ports;
    for (let i = 0; i < this.wsClients.length; i++) {
      logs = this.wsClients[i].getLogs(fpsConsts.threadGetLogs);
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
    return this.portChart.find(port => port.url == wsClientUrl && port.port == portName)
  }
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
      this.pathStrings[`${wsClientUrl}${portName}`] = ""
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
    if (portChartRef) {
      portChartRef.chart.loadDataVector(dataVector.map(log => log.value));
    }

    this.pathStrings[`${wsClientUrl}${portName}`] = portChartRef.chart.getPathString();
  }

  registerConnectedPorts = (url, ports) => {
    const sniffer = this.getRegisteredSniffer(url);
    sniffer.sensors = ports.map(port => { return { sensorType: undefined, portName: port } });
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
  getLogsInTime = seconds => {
    this.clearPresentLogs();
    this.startLogs();
    setTimeout(() => this.stopLogs(), seconds * 1000);
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
