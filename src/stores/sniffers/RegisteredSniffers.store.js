import { action, makeObservable, observable } from 'mobx';


class RegisteredSniffersStore {
  registeredSniffers = [{
    name: 'Sniffer pré cadastrado',
    url: 'ws://192.168.1.199:81',
  }];
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
  }
}

export default new RegisteredSniffersStore();
