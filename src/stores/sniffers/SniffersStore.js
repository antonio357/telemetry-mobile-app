import {makeObservable, observable, action} from 'mobx';


class SniffersStore {
  registeredSniffers = [];

  constructor() {
    makeObservable(this, {
      registeredSniffers: observable,
      registerSniffer: action,
    })
  }

  registerSniffer() {
    this.registeredSniffers.push({
      id: 'id do sniffer',
      name: 'nome do sniffer',
      title: 'sniffer title',
      webSocketServer: {
        url: 'url do websocket server',
        status: 'desconectado',
      }
    })
  }
}

export default new SniffersStore();
