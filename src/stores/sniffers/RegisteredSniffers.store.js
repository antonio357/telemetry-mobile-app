import { action, makeObservable, observable } from 'mobx';
import WsClient from '../../components/socket/WsClient';


class RegisteredSniffersStore {
  // wsClient connections
  wsClients = [];

  // observables for sniffers screens
  registeredSniffers = [];

  // for logs screen
  presentLogs = {};
  presentLogsBuffer = {};
  presentLogsBufferThread = null

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
    })

    this.register('pré cadastrado', 'ws://192.168.1.199:81'); // just for testing

    // thread for updating logs to render charts
    this.presentLogsBufferThread = setInterval(this.updateLogs, 500);
  }

  // ports and sensors
  registerConnectedPorts = (url, ports) => {
    const sniffer = this.getRegisteredSniffer(url);
    sniffer.sensors = ports.map(port => { return { sensorType: undefined, portName: port, selectOpen: false } });
  }

  setSensorType = (url, portName, sensorType) => {
    const sniffer = this.getRegisteredSniffer(url);
    const port = sniffer.sensors.find(port => port.portName == portName);
    port.sensorType = sensorType;
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
    this.wsClients.forEach(socket => socket.send('start logs'));
  }

  stopLogs = () => {
    this.wsClients.forEach(socket => socket.send('stop logs'));
  }
}

export default new RegisteredSniffersStore();
