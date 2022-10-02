import { action, makeObservable, observable } from 'mobx';


class ObservableStore {
  counter = 0;

  constructor() {
    makeObservable(this, {
      counter: observable,
      add: action,
    })
  }

  /**
   * it needs to be arrow function
   * reference https://www.youtube.com/watch?v=pKvA6IQUnaM&t=576s&ab_channel=IagoBranco
   */
  add = () => {
    // console.log(`incrementing counter = ${this.counter}`);
    this.counter += 1;
  }
}

export default new ObservableStore();
