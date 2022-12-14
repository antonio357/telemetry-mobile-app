import { action, makeObservable, observable } from 'mobx';
import WsClient from '../../components/socket/WsClient';
import { ChartDrawPath } from '../../charts/ChartDrawPath';
import DbOperations from '../../database/DbOperations';


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

  // executionInfo = {
  //   executionId: 'id',
  //   sniffers: [
  //     {
  //       wsClientUrl: 'url do sniffer',
  //       id: 'identificador do sniffer no banco',
  //       portIds: [
  //         {
  //           id: 'id1',
  //           portName: 'portName'
  //         }
  //       ]
  //     }
  //   ]
  // }
  executionInfo = {};
  executionInfoReady = false;
  database = null;

  // countLogsRecordsSaved = null;

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
      const url = this.wsClients[i].getUrl();
      logs = this.wsClients[i].getLogs(120);
      ports = Object.keys(logs);
      for (let j = 0; j < ports.length; j++) {
        const portName = ports[j];
        this.pushDataPortChart(this.wsClients[i].getUrl(), portName, logs[ports[j]]);
      }
    }
  }

  // ports and sensors
  getAllPortChart = () => {
    return this.portChart;
  }
  getAllportChartForChartCardsList = () => {
    const array = [];
    for (let i = 0; i < this.portChart.length; i++) {
      const port = this.portChart[i];
      const obj = {
        sensorName: port.port,
        sensorType: 'ultrassonic',
        timeFrame: 10,
        logsRate: 1000,
        drawPath: port.chart.getPath()
      };
      array.push(obj);
    }
    return array;
  }
  getSnifferSensorsDescription = (wsClientUrl) => {
    const filtered = this.portChart.filter(port => port.url == wsClientUrl);
    return filtered.map(sensorDescription => {
      return {
        sensorType: 'ultrassonic',
        portName: sensorDescription.port,
        sensorName: sensorDescription.port,
      };
    })
  }
  getPortChart = (wsClientUrl, portName) => {
    return this.portChart.find(port => port.url == wsClientUrl && port.port == portName)
  }
  createChart = () => {
    // return new LineChart([0, 100], [0, 255]);
    return new ChartDrawPath('ultrassonic');
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
      portChartRef.chart.loadDataVector(dataVector);
    }
  }
  cleanAllCharts = () => {
    for (let i = 0; i < this.portChart.length; i++) {
      this.portChart[i].chart.resetDraw();
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

  startLogs = async () => {
    await this.setUpExecutionInfo();
    this.cleanAllCharts();
    this.wsClients.forEach(socket => socket.send('start logs'));
    this.lastCmdToAllWsClients = "start logs";
  }

  stopLogs = async () => {
    this.lastCmdToAllWsClients = "stop logs";
    this.wsClients.forEach(socket => socket.send('stop logs'));
    const count = await DbOperations.countRecords();
    console.log(`count = ${JSON.stringify(count)}`);
    const execution = await DbOperations.findExecution(this.executionInfo.executionId);
    execution['name'] = 'new name inserted by user';
    const date = new Date();
    execution['endTime'] = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`;
    await DbOperations.updateExecution(this.executionInfo.executionId, execution);
    // const executionInfo = await DbOperations.findExecutionInfo(this.executionInfo.executionId);
    // console.log(`executionInfo = ${JSON.stringify(executionInfo)}`);
    // await DbOperations.removeExecution(this.executionInfo.executionId);
    // const count_after_remove = await DbOperations.countRecords();
    // console.log(`count_after_remove = ${JSON.stringify(count_after_remove)}`);
  }

  setUpExecutionInfo = async () => {
    this.executionInfoReady = false;
    this.executionInfo = {};
    const date = new Date();
    const execution = {
      name: 'temporary name',
      initDate: `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`,
      initTime: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`,
    };
    this.executionInfo = await DbOperations.createExecution(execution, this.wsClients, this.portChart);
    this.executionInfoReady = true;
  }

  printDbExecutionInfo = () => {
    console.log(`this.executionInfo = ${JSON.stringify(this.executionInfo)}`);
  }

  getDbPortsIds = wsServerUrl => {
    // console.log(`on store getDbPortsIds(wsServerUrl = ${wsServerUrl})`);
    const executionInfo = this.executionInfo;
    // console.log(`on store this.executionInfo = ${JSON.stringify(executionInfo)}`);
    if (this.executionInfoReady) {
      const portsInfo = {};
      const portsIds = executionInfo.sniffers.find(sniffer => sniffer.wsClientUrl == wsServerUrl).portIds;
      for (let i = 0; i < portsIds.length; i++) {
        const port = portsIds[i];
        portsInfo[port.portName] = { id: port.id, logs: [] }
      }
      // console.log(`on store getDbPortsIds return portsInfo = ${JSON.stringify(portsInfo)}`);
      return portsInfo;
    } else {
      return null;
    }
  }
}

export default new RegisteredSniffersStore();
