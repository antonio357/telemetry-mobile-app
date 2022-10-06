import RegisteredSniffersStore from '../../stores/sniffers/RegisteredSniffers.store';

class WsClient {
  name = '';
  url = '';
  ws = null;
  logsBuffer = {};

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
        const ports = Object.keys(logs);
        for (let i = 0; i < ports.length; i++) {
          this.logsBuffer[ports[i]] = this.logsBuffer[ports[i]] ? [...this.logsBuffer[ports[i]], ...logs[ports[i]]] : [...logs[ports[i]]];
        }
      }
      else if (connectedPorts) {
        // { connectedPorts: ["port1", "port2"] };
        const { registerConnectedPorts } = RegisteredSniffersStore;
        registerConnectedPorts(this.getUrl(), connectedPorts);
      }
    }
  }

  disconnect = () => {
    if (this.ws) this.ws.close();
  }

  getLogs = (logsQuantByPort = 1) => {
    const ports = Object.keys(this.logsBuffer);
    let logs = {};
    for (let i = 0; i < ports.length; i++) {
      logs[ports[i]] = this.logsBuffer[ports[i]].splice(0, logsQuantByPort);
    }
    return logs;
  }

  setLogsBufferPort = portName => {
    this.logsBuffer[portName] = this.logsBuffer[portName] ? [...this.logsBuffer[portName]] : [];
  }

  removeLogsBufferPort = portName => {
    delete this.logsBuffer[portName];
  }
}

export default WsClient;
