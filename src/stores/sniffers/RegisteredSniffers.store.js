import { action, makeObservable, observable } from 'mobx';
import WsClient from '../../components/socket/WsClient';


class RegisteredSniffersStore {
  registeredSniffers = [];
  wsClients = [];

  counter = -1;
  presentLogsUpdatesCounter = 0;
  graphUpdatesCounter = 0;
  presentLogs = {};
  presentLogsBuffer = {};
  presentLogsBufferThread = null

  wsClientsCheckerThread = null;

  constructor() {
    makeObservable(this, {
      registeredSniffers: observable,
      presentLogs: observable,
      updateLogs: action,
      register: action,
      connect: action,
      disconnect: action,
      updateSnifferStatus: action,
      addPresentLogs: action,
      clearPresentLogs: action,
      registerConnectedPorts: action,
      setSensorType: action,
      toggleSensorTypeSelectionOpen: action,
      getSelectOpen: action,

    })
    this.register('pré cadastrado', 'ws://192.168.1.199:81');
    // this.setCheckwsClientsThread(true);
    this.presentLogsBufferThread = setInterval(this.updateLogs, 500);
  }

  // getConnectedPorts = url => {
  //   const ws = this.wsClients.find(socket => socket.getUrl() == url);

  // } 

  toggleSensorTypeSelectionOpen = (url, portName) => {
    const sniffer = this.getRegisteredSniffer(url);
    const port = sniffer.sensors.find(port => port.portName == portName);
    // console.log(`before toggleSensorTypeSelectionOpen(${url}, ${portName}) -> sniffer.url = ${this.getRegisteredSniffer(url).url} -> port.selectOpen = ${this.getRegisteredSniffer(url).sensors.find(port => port.portName == portName).selectOpen}`);
    port.selectOpen = !port.selectOpen;
    // console.log(`after toggleSensorTypeSelectionOpen(${url}, ${portName}) -> sniffer.url = ${this.getRegisteredSniffer(url).url} -> port.selectOpen = ${this.getRegisteredSniffer(url).sensors.find(port => port.portName == portName).selectOpen}`);
  }

  getSelectOpen = (url, portName) => {
    const sniffer = this.getRegisteredSniffer(url);
    const port = sniffer.sensors.find(port => port.portName == portName);
    return port.selectOpen;
  }

  registerConnectedPorts = (url, ports) => {
    const sniffer = this.getRegisteredSniffer(url);
    sniffer.sensors = ports.map(port => { return { sensorType: undefined, portName: port, selectOpen: false } });
  }

  setSensorType = (url, portName, sensorType) => {
    // console.log(`setSensorType(${url}, ${portName}, ${sensorType})`);
    const sniffer = this.getRegisteredSniffer(url);
    const port = sniffer.sensors.find(port => port.portName == portName);
    // console.log(`before setSensorType(${url}, ${portName}, ${sensorType}) -> sniffer.url = ${this.getRegisteredSniffer(url).url} -> port.portName = ${this.getRegisteredSniffer(url).sensors.find(port => port.portName == portName).portName} -> port.sensorType = ${this.getRegisteredSniffer(url).sensors.find(port => port.portName == portName).sensorType}`);
    port.sensorType = sensorType;
    // console.log(`after setSensorType(${url}, ${portName}, ${sensorType}) -> sniffer.url = ${this.getRegisteredSniffer(url).url} -> port.portName = ${this.getRegisteredSniffer(url).sensors.find(port => port.portName == portName).portName} -> port.sensorType = ${this.getRegisteredSniffer(url).sensors.find(port => port.portName == portName).sensorType}`);
  }

  graphUpdateCount = () => {
    this.graphUpdatesCounter += 1;
  }

  updateLogs = () => {
    // if (this.presentLogsBuffer.length > 0) {
    //   this.presentLogs = [...this.presentLogsBuffer];
    //   // this.presentLogsBuffer = [];
    //   this.presentLogsUpdatesCounter += 1;
    // }

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
    // console.log(`this.presentLogs = ${JSON.stringify(this.presentLogs)}`);
  }

  getRegisteredSniffer = url => {
    return this.registeredSniffers.find(sniffer => sniffer.url == url);
  }

  // setCheckwsClientsThread = bool => {
  //   if (bool) {
  //     if (!this.wsClientsCheckerThread) {
  //       this.wsClientsCheckerThread = setTimeout(() => {
  //         this.wsClients.forEach(socket => {
  //           if (socket.isConnected()) socket.send('ping');
  //         });
  //       }, 2000);
  //     }
  //   }
  //   else {
  //     if (this.wsClientsCheckerThread) {
  //       clearInterval(this.wsClientsCheckerThread);
  //       this.wsClientsCheckerThread = null;
  //     }
  //   }
  // }

  getLogsInTime = seconds => {
    // console.log(`presentLogs = ${JSON.stringify(this.presentLogs)}`);
    this.clearPresentLogs();
    this.startLogs();
    setTimeout(() => this.stopLogs(), seconds * 1000);
    this.presentLogsUpdatesCounter = 0;
    this.graphUpdatesCounter = 0;
  }

  startLogs = () => {
    this.wsClients.forEach(socket => socket.send('start logs'));
  }

  stopLogs = () => {
    // console.log(`called stop logs`);
    this.wsClients.forEach(socket => socket.send('stop logs'));
    // console.log(`this.presentLogsUpdatesCounter = ${this.presentLogsUpdatesCounter}, this.graphUpdatesCounter = ${this.graphUpdatesCounter};`);
  }

  addPresentLogs = (url, logs) => {
    const consts = {
      socketTransferRateInMili: 300,
      timelineInSeconds: 5,
    }
    const limit = 100; // 1 log a cada 10 ms, 1000 logs a cada 10000ms (10 segundos)
    // if (this.presentLogsBuffer.length >= limit) this.presentLogsBuffer.shift();
    // this.counter += 1;
    // this.presentLogsBuffer.push({ y: logs, x: this.counter });
    if (!this.presentLogsBuffer[url]) {
      this.presentLogsBuffer[url] = {};
      Object.keys(logs[0]).forEach(port => {
        this.presentLogsBuffer[url][port] = [];
      });
    }
    logs.forEach(log => {
      Object.keys(log).forEach(port => {
        if (this.presentLogsBuffer[url][port].length >= limit) this.presentLogsBuffer[url][port].shift();
        this.presentLogsBuffer[url][port].push({ y: log[port], x: this.counter });
      });
      this.counter += 1;
    });
  }

  clearPresentLogs = () => {
    this.presentLogsBuffer = {};
    this.counter = -1;
  }

  register = (name, url) => {
    this.registeredSniffers.push({
      name: name,
      url: url,
      status: 'desconectado',
      sensors: [],
    });
    this.wsClients.push(new WsClient(name, url));
  }

  updateSnifferStatus = (url, status) => {
    const sniffer = this.registeredSniffers.filter(sniffer => sniffer.url == url)[0];
    if (sniffer) sniffer.status = status;
    // console.log(`updateSnifferStatus(${url}, ${status}) -> \nthis.registeredSniffers.filter(sniffer => sniffer.url == ${url})[0].status = ${this.registeredSniffers.filter(sniffer => sniffer.url == url)[0].status}`);
  }

  connect = url => {
    const wsClient = this.wsClients.filter(socket => socket.url == url)[0];
    if (wsClient) wsClient.connect();
  }

  disconnect = url => {
    const wsClient = this.wsClients.filter(socket => socket.url == url)[0];
    if (wsClient) wsClient.disconnect();
  }
}

export default new RegisteredSniffersStore();
