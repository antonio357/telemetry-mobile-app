import { makeObservable, observable, action } from 'mobx';

class WsSocket {
  id = '';
  url = '';
  status = '';
  ws = null;

  constructor(id, url) {
    this.id = id || 'sniffer pre cadastrado';
    this.url = url || 'ws://192.168.1.199:81';
    makeObservable(this, {
      id: observable,
      url: observable,
      status: observable,
      ws: observable,
      // connect: action,
      // disconnect: action,
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

  connect() {
    this.ws = new WebSocket(this.url);
    this.ws.onopen = obj => {
      console.log(`ws = ${this.url} onopen: \nwebsocket client connected to websocket server ${this.url}`);
      status = 'conectado';
    }
    this.ws.onclose = obj => {
      console.log(`ws = ${this.url} onclose: \nclose.code = ${obj.code}, close.reason = ${obj.reason}`);
      status = 'desconectado';
    }
    this.ws.onerror = obj => {
      console.log(`ws = ${this.url} onerror: \nerror.message = ${obj.message}`);
      this.ws.close();
    }
    this.ws.onmessage = obj => console.log(`ws = ${this.ws.url} onmessage: \nmessage.data = ${obj.data}`);
  }

  disconnect() {
    this.ws.close();
  }
}

export default WsSocket;
