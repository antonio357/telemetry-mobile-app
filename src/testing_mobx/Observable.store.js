import { action, makeObservable, observable } from 'mobx';


class ObservableStore {
  counter = 0;

  constructor() {
    makeObservable(this, {
      counter: observable,
      add: action,
    })
  }

  add = () => {
    console.log(`incrementing counter = ${this.counter}`);
    this.counter += 1;
  }
}

export default new ObservableStore();
