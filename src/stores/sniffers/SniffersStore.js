import { makeObservable, observable, action } from 'mobx';
import wsSocket from '../../components/sniffer/wsSocket';


class SniffersStore {
  wsClients = [new wsSocket('sniffer pre cadastrado', 'ws://192.168.1.199:81')];

  registeredSniffers = [{
    id: 'sniffer pre cadastrado',
    name: 'sniffer pre cadastrado',
    url: 'ws://192.168.1.199:81',
    status: 'desconectado',
  }];

  constructor() {
    makeObservable(this, {
      registeredSniffers: observable,
      wsClients: observable,
      registerSniffer: action,
    })
  }

  registerSniffer(sniffer) {
    this.registeredSniffers.push(sniffer);
  }
}

export default new SniffersStore();
