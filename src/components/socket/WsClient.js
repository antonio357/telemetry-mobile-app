import RegisteredSniffersStore from '../../stores/sniffers/RegisteredSniffers.store';

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

  send = cmd => {
    this.ws.send(cmd);
  }

  connect = () => {
    console.log(`connecting ...`);
    if (this.ws) this.ws = null; 
    this.ws = new WebSocket(this.url);
    this.ws.onopen = open => {
      console.log(`ws = ${this.url} onopen: \nwebsocket client connected to websocket server ${this.url}`);
      const { updateSnifferStatus } = RegisteredSniffersStore;
      updateSnifferStatus(this.url, 'conectado');
    }
    this.ws.onclose = close => {
      console.log(`ws = ${this.url} onclose: \nclose.code = ${close.code}, close.reason = ${close.reason}`);
      const { updateSnifferStatus } = RegisteredSniffersStore;
      updateSnifferStatus(this.url, 'desconectado');
    }
    this.ws.onerror = error => {
      console.log(`ws = ${this.url} onerror: \nerror.message = ${error.message}`);
      this.ws.close();
    }
    this.ws.onmessage = message => {
      // console.log(`ws = ${this.ws.url} onmessage: \nmessage.data = ${message.data}`);
      const { addPresentLogs } = RegisteredSniffersStore;
      addPresentLogs(message.data);
    }
  }

  disconnect = () => {
    console.log(`disconnecting ...`);
    if (this.ws) this.ws.close();
  }
}

export default WsClient;
