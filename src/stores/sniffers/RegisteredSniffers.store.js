import { action, makeObservable, observable } from 'mobx';
import WsClient from '../../components/socket/WsClient';


class RegisteredSniffersStore {
  registeredSniffers = [];
  wsClients = [];

  counter = -1;
  presentLogsUpdatesCounter = 0;
  graphUpdatesCounter = 0;
  presentLogs = [];
  presentLogsBuffer = [];
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
    })
    this.register('pré cadastrado', 'ws://192.168.1.199:81');
    // this.setCheckwsClientsThread(true);
    this.presentLogsBufferThread = setInterval(this.updateLogs, 300);
  }

  graphUpdateCount = () => {
    this.graphUpdatesCounter += 1;
  }

  updateLogs = () => {
    if (this.presentLogsBuffer.length > 0) {
      this.presentLogs = [...this.presentLogsBuffer];
      // this.presentLogsBuffer = [];
      this.presentLogsUpdatesCounter += 1;
    }
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
    console.log(`presentLogs = ${JSON.stringify(this.presentLogs)}`);
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
    console.log(`called stop logs`);
    this.wsClients.forEach(socket => socket.send('stop logs'));
    console.log(`this.presentLogsUpdatesCounter = ${this.presentLogsUpdatesCounter}, this.graphUpdatesCounter = ${this.graphUpdatesCounter};`);
  }

  addPresentLogs = log => {
    const consts = {
      socketTransferRateInMili: 300,
      timelineInSeconds: 5,
    }
    const limit = parseInt(1000 * consts.timelineInSeconds / consts.socketTransferRateInMili); // 1 log a cada 10 ms, 1000 logs a cada 10000ms (10 segundos)
    if (this.presentLogsBuffer.length >= limit) this.presentLogsBuffer.shift();
    this.counter += 1;
    this.presentLogsBuffer.push({ y: log, x: this.counter });
  }

  clearPresentLogs = () => {
    this.presentLogs = [];
    this.counter = -1;
  }

  register = (name, url) => {
    this.registeredSniffers.push({
      name: name,
      url: url,
      status: 'desconectado',
    });
    this.wsClients.push(new WsClient(name, url));
  }

  updateSnifferStatus = (url, status) => {
    const sniffer = this.registeredSniffers.filter(sniffer => sniffer.url == url)[0];
    if (sniffer) sniffer.status = status;
    console.log(`updateSnifferStatus(${url}, ${status}) -> \nthis.registeredSniffers.filter(sniffer => sniffer.url == ${url})[0].status = ${this.registeredSniffers.filter(sniffer => sniffer.url == url)[0].status}`);
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
