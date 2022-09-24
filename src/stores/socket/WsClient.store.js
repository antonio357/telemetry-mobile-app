import { action, makeObservable, observable } from 'mobx';

class WsClientStore {
  name = '';
  url = '';
  ws = null;
  connectionStatus = '';

  constructor(name, url) {
    this.name = name;
    this.url = url;
    this.connectionStatus = 'desconectado';
    makeObservable(this, {
      connectionStatus: observable,
      connect: action,
      disconnect: action,
    })
  }

  getStatusString() {
    const connectionStates = {
      0: 'CONNECTING',
      1: 'OPEN',
      2: 'CLOSING',
      3: 'CLOSED',
    }

    if (this.ws) return connectionStates[ws.readyState];
    else return 'There is no websocket'
  }

  connect = () => {
    console.log(`connecting ...`);
    this.connectionStatus = 'conectado';
    // this.ws = new WebSocket(this.url);
    // this.ws.onopen = open => {
    //   console.log(`ws = ${this.url} onopen: \nwebsocket client connected to websocket server ${this.url}`);
    //   this.connectionStatus = 'conectado';
    // }
    // this.ws.onclose = close => {
    //   console.log(`ws = ${this.url} onclose: \nclose.code = ${close.code}, close.reason = ${close.reason}`);
    //   this.connectionStatus = 'desconectado';
    //   this.ws = null;
    // }
    // this.ws.onerror = error => {
    //   console.log(`ws = ${this.url} onerror: \nerror.message = ${error.message}`);
    //   this.ws.close();
    // }
    // this.ws.onmessage = message => console.log(`ws = ${this.ws.url} onmessage: \nmessage.data = ${message.data}`);
  }

  disconnect = () => {
    console.log(`disconnecting ...`);
    this.connectionStatus = 'desconectado';
    if (this.ws) this.ws.close();
  }
}

export default new WsClientStore();
