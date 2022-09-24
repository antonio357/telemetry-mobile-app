class WsClient {
  name = '';
  url = '';
  ws = null;

  constructor(name, url) {
    this.name = name;
    this.url = url;
  }

  isConnected = () => {
    return this.getStatusString() == 'OPEN' ? true : false;
  }

  getUrl = () => { return this.url };

  getStatusString = () => {
    const connectionStates = {
      0: 'CONNECTING',
      1: 'OPEN',
      2: 'CLOSING',
      3: 'CLOSED',
    }

    if (this.ws) return connectionStates[this.ws.readyState];
    else return 'There is no websocket'
  }

  connect = () => {
    console.log(`connecting ...`);
    this.ws = new WebSocket(this.url);
    this.ws.onopen = open => {
      console.log(`ws = ${this.url} onopen: \nwebsocket client connected to websocket server ${this.url}`);
    }
    this.ws.onclose = close => {
      console.log(`ws = ${this.url} onclose: \nclose.code = ${close.code}, close.reason = ${close.reason}`);
      this.ws = null;
    }
    this.ws.onerror = error => {
      console.log(`ws = ${this.url} onerror: \nerror.message = ${error.message}`);
      this.ws.close();
    }
    this.ws.onmessage = message => console.log(`ws = ${this.ws.url} onmessage: \nmessage.data = ${message.data}`);
  }

  disconnect = () => {
    console.log(`disconnecting ...`);
    if (this.ws) this.ws.close();
  }
}

export default WsClient;
