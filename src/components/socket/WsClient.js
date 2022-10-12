import RegisteredSniffersStore from '../../stores/sniffers/RegisteredSniffers.store';
import {database } from '../../../App';

class WsClient {
  name = '';
  url = '';
  ws = null;
  logsBuffer = {};
  // {
  //   port1: {
  //     date: "2022-09-01",
  //     initTimestamp: "14:30:45:555",
  //   },
  //   ...
  // }
  logsSaveInfo = {};

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
    if (cmd == "start logs") {
      const { createLogsRegister } = database;
      const ports = Object.keys(this.logsBuffer);
      const d = new Date();
      const date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      const initTimestamp = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}`;
      this.logsSaveInfo = {};
      for (let i = 0; i < ports.length; i++) {
        this.logsSaveInfo[ports[i]] = { date: date, initTimestamp: initTimestamp };
        createLogsRegister(this.getUrl(), ports[i], date, initTimestamp);
      }
    } else if (cmd == "stop logs") {
      const { printSensorLogs } = database;
      const ports = Object.keys(this.logsBuffer);
      for (let i = 0; i < ports.length; i++) {
        this.logsSaveInfo[ports[i]] = { date: date, initTimestamp: initTimestamp };
        printSensorLogs(this.getUrl(), ports[i], date, initTimestamp);
      }
    }

    this.ws.send(cmd);
  }

  saveLogs = (logs) => {
    const { appendSensorLogs } = database;
    const ports = Object.keys(logs);
    for (let i = 0; i < ports.length; i++) {
      const { date, initTimestamp } = this.logsSaveInfo[ports[i]];
      appendSensorLogs(this.getUrl(), ports[i], date, initTimestamp, logs[ports[i]]);
    }
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

        // coloca os logs no banco de dados
        this.saveLogs(logs);

        // coloca logs no buffer pros sensores em tempo real
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
