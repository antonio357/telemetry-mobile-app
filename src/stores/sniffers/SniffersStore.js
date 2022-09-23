import { makeObservable, observable, action } from 'mobx';


class SniffersStore {
  registeredSniffers = [];

  constructor() {
    makeObservable(this, {
      registeredSniffers: observable,
      registerSniffer: action,
    })
  }

  registerSniffer(sniffer) {
    this.registeredSniffers.push(sniffer);
  }
}

export default new SniffersStore();
