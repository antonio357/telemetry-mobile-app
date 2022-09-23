export default class WsSocket {
  constructor(id, url) {
    this.id = id || 'sniffer pre cadastrado';
    this.url = url || 'ws://192.168.1.199:81';
    this.ws = null;
  }

  timeout = 250; // Initial timeout duration as a class variable

  getStatusString() {
    const connectionStates = {
      0: 'CONNECTING',
      1: 'OPEN',
      2: 'CLOSING',
      3: 'CLOSED',
    }

    if (this.ws) return connectionStates[this.ws.readyState]
    else return 'There is no websocket'
  }

  connect() {
    this.ws = new WebSocket(this.url);
    this.onopen = obj => console.log(`ws = ${this.url} onopen: \nwebsocket client connected to websocket server ${this.url}`);
    this.onclose = obj => console.log(`ws = ${this.url} onclose: \nclose.code = ${obj.code}, close.reason = ${obj.reason}`);
    this.onerror = obj => {
      console.log(`ws = ${this.url} onerror: \nerror.message = ${obj.message}`);
      this.ws.close();
    }
    this.ws.onmessage = obj => console.log(`ws = ${this.ws.url} onmessage: \nmessage.data = ${obj.data}`);
  }

  disconnect() {
    this.ws.close();
  }
}
