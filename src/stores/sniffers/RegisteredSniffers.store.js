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

  constructor() {
    makeObservable(this, {
      registeredSniffers: observable,
      register: action,
      connect: action,
      disconnect: action,
      updateSnifferStatus: action,
    })
  }

  register = () => {
    this.registeredSniffers.push({
      name: 'Sniffer pré cadastrado',
      url: 'ws://192.168.1.199:81',
      status: 'desconectado',
    });
    this.wsClients.push(new WsClient('Sniffer pré cadastrado','ws://192.168.1.199:81'));
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
