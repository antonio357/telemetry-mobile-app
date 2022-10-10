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
    this.happened = false;
  }

  pushData = data => {
    let totalLength = 300;
    const how_many_times = 20; // min = 1, quanto maior mais ajuda na performance, pq economiza na quantidade de operações na operação de trim e de offset, deve crescer com a quantidade de logs esperado (faixa de tempo), quantos logs existiram nessa faixa de tempo, pra evitar de fazer um trim grande e visualmente parecer que comeu um pedaço do grágico
    const logsExpected = 10000;
    const grain = totalLength / logsExpected;
    if (this.path.countPoints <= 0) { // Path vazio
      this.path.lineTo(0, data);
    } else { // Path já tem ao menos um dado
      if (this.path.getLastPt().x >= totalLength) { // Path ta cheio
        // corta o inicício
        this.path.trim(grain / totalLength * how_many_times, 1, false); // isComplement = false evita que o gráfico seja apagado caso a operação de trim retorne null
        // move pra o ponto x = 0
        this.path.offset(0 - this.path.getPoint(0).x, 0);
        // this.path.moveTo(this.path.getLastPt().x, this.path.getLastPt().y);
      }
      const newX = this.path.getLastPt().x + grain;
      // this.path.setIsVolatile()
      this.path.lineTo(newX, data);
    }
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
      lastCmdToAllWsClients: observable,
      startLogs: action,
      stopLogs: action,
    })

    this.register('pré cadastrado', 'ws://192.168.1.199:81'); // just for testing

    // thread gets logs from WsClient buffers and pushes them to the charts
    this.loadLogsThread = setInterval(this.getWsClientsBufferedLogs, 0);
  }

  getWsClientsBufferedLogs = () => {
    let logs; 
    let ports;
    for (let i = 0; i < this.wsClients.length; i++) {
      logs = this.wsClients[i].getLogs(120);
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
