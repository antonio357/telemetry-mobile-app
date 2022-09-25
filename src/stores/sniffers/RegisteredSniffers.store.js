import { action, makeObservable, observable } from 'mobx';
import WsClient from '../../components/socket/WsClient';


class RegisteredSniffersStore {
  registeredSniffers = [{
    name: 'Sniffer pré cadastrado',
    url: 'ws://192.168.1.199:81',
    status: 'desconectado',
  }];

  wsClients = [
    new WsClient('Sniffer pré cadastrado', 'ws://192.168.1.199:81'),
  ];

  counter = -1;
  presentLogs = [];

  constructor() {
    makeObservable(this, {
      registeredSniffers: observable,
      presentLogs: observable,
      register: action,
      connect: action,
      disconnect: action,
      updateSnifferStatus: action,
      addPresentLogs: action,
      clearPresentLogs: action,
    })
  }

  getLogsInTime = seconds => {
    console.log(`presentLogs = ${JSON.stringify(this.presentLogs)}`);
    this.clearPresentLogs();
    this.startLogs();
    setTimeout(() => this.stopLogs(), seconds * 1000);
  }

  startLogs = () => {
    this.wsClients.forEach(socket => socket.send('start logs'));
  }

  stopLogs = () => {
    console.log(`called stop logs`);
    this.wsClients.forEach(socket => socket.send('stop logs'));
  }

  addPresentLogs = log => {
    const consts = {
      socketTransferRateInMili: 200,
      timelineInSeconds: 5,
    }
    const limit = parseInt(1000 * consts.timelineInSeconds / consts.socketTransferRateInMili) ; // 1 log a cada 10 ms, 1000 logs a cada 10000ms (10 segundos)
    if (this.presentLogs.length >= limit) this.presentLogs.shift();
    this.counter += 1;
    this.presentLogs.push({y: log, x: this.counter});
  }

  clearPresentLogs = () => {
    this.presentLogs = [];
    this.counter = -1;
  }

  register = () => {
    this.registeredSniffers.push({
      name: 'Sniffer pré cadastrado',
      url: 'ws://192.168.1.199:81',
      status: 'desconectado',
    });
    this.wsClients.push(new WsClient('Sniffer pré cadastrado', 'ws://192.168.1.199:81'));
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
