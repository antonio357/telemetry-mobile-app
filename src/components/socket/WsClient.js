import RegisteredSniffersStore from '../../stores/sniffers/RegisteredSniffers.store';
import DbOperations from '../../database/DbOperations';


class WsClient {
  name = '';
  url = '';
  ws = null;
  logsBuffer = {};

  detDbInfoThread = null;
  database = null;
  // dbLogsBuffer = {
  //   port1: {
  //     id: 'id do banco',
  //     logs: []
  //   },
  //   port2: {
  //     id: 'id do banco',
  //     logs: []
  //   }
  // };
  dbLogsBuffer = {};
  dbLogsBufferTimer = 10000;
  dbLastSaveTime = new Date().getTime(); // tempo em ms da ultima vez em que salvou os logs no banco

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
      this.setToSaveLogs();
    } else if (cmd == "stop logs") {
      this.saveLogs(true);
      this.resetToSaveLogs();
    }
    this.ws.send(cmd);
  }

  resetToSaveLogs = () => {
    this.dbLogsBuffer = {};
  }

  setToSaveLogs = () => {
    const { printDbExecutionInfo } = RegisteredSniffersStore;
    printDbExecutionInfo();
    const { getDbPortsIds } = RegisteredSniffersStore;
    this.dbLogsBuffer = getDbPortsIds(this.getUrl());
    this.dbLastSaveTime = new Date().getTime();
  }


  bufferDbLogs = logs => {
    const ports = Object.keys(this.dbLogsBuffer);
    for (let i = 0; i < ports.length; i++) {
      const port = ports[i];
      this.dbLogsBuffer[port].logs = [...this.dbLogsBuffer[port].logs, ...logs[port]];
    }
  }

  saveLogs = (onStopLogs = false) => {
    const actualTime = new Date().getTime();
    if (onStopLogs || actualTime - this.dbLastSaveTime > this.dbLogsBufferTimer) {
      const ports = Object.keys(this.dbLogsBuffer);
      for (let i = 0; i < ports.length; i++) {
        const key = ports[i];
        const port = this.dbLogsBuffer[key];
        DbOperations.appendLogsOnPort(this.dbLogsBuffer[key].logs.splice(0), port.id);
      }
      this.dbLastSaveTime = new Date().getTime();
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
        for (let i = 0; i < ports.length; i++) {
          this.logsBuffer[ports[i]] = this.logsBuffer[ports[i]] ? [...this.logsBuffer[ports[i]], ...logs[ports[i]]] : [...logs[ports[i]]];
        }

        this.bufferDbLogs(logs);
        this.saveLogs();
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
