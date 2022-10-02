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
    if (this.ws) this.ws = null;
    this.ws = new WebSocket(this.url);

    this.ws.onopen = open => {
      const { updateSnifferStatus } = RegisteredSniffersStore;
      this.send("ports");
      updateSnifferStatus(this.url, 'conectado');
    }

    this.ws.onclose = close => {
      const { updateSnifferStatus } = RegisteredSniffersStore;
      updateSnifferStatus(this.url, 'desconectado');
    }

    this.ws.onerror = error => {
      this.ws.close();
    }

    this.ws.onmessage = message => {
      const { connectedPorts, logs } = JSON.parse(message.data);
      if (logs) {
        const { addPresentLogs } = RegisteredSniffersStore;
        addPresentLogs(this.getUrl(), logs);
      }
      else if (connectedPorts) {
        const { registerConnectedPorts } = RegisteredSniffersStore;
        registerConnectedPorts(this.getUrl(), connectedPorts)
      }
    }
  }

  disconnect = () => {
    if (this.ws) this.ws.close();
  }
}

export default WsClient;
