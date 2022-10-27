import RegisteredSniffersStore from '../../stores/sniffers/RegisteredSniffers.store';
import { DataBaseOperations } from '../../databases/DataBaseOperations';


class WsClient {
  name = '';
  url = '';
  ws = null;
  logsBuffer = {};

  detDbInfoThread = null;
  database = new DataBaseOperations();
  dbExecutionId; // id da execução atual
  // dbLogsBuffer = {
  //   port1: {
  //     id: 'id do banco',
  //     logs: [
  //       {
  //         value: '123',
  //         time: 500
  //       }
  //     ]
  //   }
  // };
  dbLogsBuffer = {};
  dbLogsBufferTimer = 10000;
  dbLastSaveTime; // tempo em ms da ultima vez em que salvou os logs no banco

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
    this.dbExecutionId = null;
    this.dbLogsBuffer = {};
  }

  setToSaveLogs = () => {
    const { printDbExecutionInfo } = RegisteredSniffersStore;
    printDbExecutionInfo();
    const { getDbExecutionId, getDbPortsIds } = RegisteredSniffersStore;
    this.dbExecutionId = getDbExecutionId();
    this.dbLogsBuffer = getDbPortsIds();
    this.dbLastSaveTime = new Date().getTime();
  }

  checkDbInfo = () => {
    const keys = Object.keys(this.dbExecutionId);
    if (keys.length > 0) return;
    else this.setToSaveLogs();
  }

  bufferDbLogs = logs => {
    const ports = Object.keys(logs);
    for (let i = 0; i < ports.length; i++) {
      const logsBuffer = this.dbLogsBuffer[ports[i]].logs;
      logsBuffer = [...logsBuffer, ...logs];
    }
  }

  saveLogs = (onStopLogs = false) => {
    const actualTime = new Date().getTime();
    if (onStopLogs || actualTime - this.dbLastSaveTime > this.dbLogsBufferTimer) {
      const ports = Object.keys(this.dbLogsBuffer);
      for (let i = 0; i < ports.length; i++) {
        const portBrickName = ports[i];
        this.database.appendLogs(this.dbLogsBuffer[portBrickName].logs.splice(0), this.dbLogsBuffer[portBrickName].id);
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

        this.checkDbInfo();
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
