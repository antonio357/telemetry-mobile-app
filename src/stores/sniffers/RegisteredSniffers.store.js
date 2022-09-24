import { action, makeObservable, observable } from 'mobx';
import WsClient from '../../components/socket/WsClient';


class RegisteredSniffersStore {
  registeredSniffers = [{
    name: 'Sniffer pré cadastrado',
    url: 'ws://192.168.1.199:81',
  }];

  wsClients = [
    new WsClient('Sniffer pré cadastrado', 'ws://192.168.1.199:81'),
  ];

  counter = 0;

  constructor() {
    makeObservable(this, {
      registeredSniffers: observable,
      register: action,
    })
  }

  register = () => {
    console.log(`registered new sniffer`);
    this.counter += 1;
    this.registeredSniffers.push({
      name: 'Sniffer pré cadastrado',
      url: `ws://192.168.1.199:81 index = ${this.counter}`,
    });
    this.wsClients.push(new WsClient('Sniffer pré cadastrado',`ws://192.168.1.199:81 index = ${this.counter}`));
  }

  getWsClient = url => { return this.wsClients.filter(socket => socket.getUrl() == url)[0] || null; }
}

export default new RegisteredSniffersStore();
