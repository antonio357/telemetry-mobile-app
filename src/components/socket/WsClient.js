import RegisteredSniffersStore from '../../stores/sniffers/RegisteredSniffers.store';
import DbOperations from '../../database/DbOperations';


class WsClient {
  name = '';
  url = '';
  ws = null;
  logsBuffer = {};

  detDbInfoThread = null;
  database = null;
  // dbExecutionId; // id da execução atual
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
      // console.log(`on sniffer sending start logs`);
      this.setToSaveLogs();
    } else if (cmd == "stop logs") {
      this.saveLogs(true);
      this.resetToSaveLogs();
    }
    this.ws.send(cmd);
  }

  resetToSaveLogs = () => {
    // this.dbExecutionId = null;
    this.dbLogsBuffer = {};
  }

  setToSaveLogs = () => {
    const { printDbExecutionInfo } = RegisteredSniffersStore;
    printDbExecutionInfo();
    const { getDbPortsIds } = RegisteredSniffersStore;
    // this.dbExecutionId = getDbExecutionId();
    this.dbLogsBuffer = getDbPortsIds(this.getUrl());
    console.log(`config this.dbLogsBuffer = ${JSON.stringify(this.dbLogsBuffer)}`);
    this.dbLastSaveTime = new Date().getTime();
    // console.log(`on sniffer setToSaveLogs`);
    // console.log(`this.dbExecutionId = ${this.dbExecutionId}`);
  }

  checkDbInfo = () => {
    // console.log(`on sinffer checkDbInfo()`);
    const keys = Object.keys(this.dbLogsBuffer);
    if (keys.length > 0) return;
    else {
      this.setToSaveLogs();
      // console.log(`on sinffer this.setToSaveLogs();`);
    }
  }

  bufferDbLogs = logs => {
    // console.log(`on sinffer bufferDbLogs()`);
    const ports = Object.keys(logs);
    for (let i = 0; i < ports.length; i++) {
      const port = ports[i];
      // console.log(`this.dbLogsBuffer = ${JSON.stringify(this.dbLogsBuffer)}`);
      // console.log(`port = ${port}`);
      // console.log(`this.dbLogsBuffer[port] = ${JSON.stringify(this.dbLogsBuffer[port])}`);
      // const logsBuffer = this.dbLogsBuffer[port].logs;
      this.dbLogsBuffer[port].logs = [...this.dbLogsBuffer[port].logs, ...logs[port]];
      // console.log(`bufferLen = ${this.dbLogsBuffer[port].logs.length}`);
      // console.log(`logsBuffer = ${JSON.stringify(logsBuffer)}`);
      // console.log(`this.dbLogsBuffer[port].logs = ${JSON.stringify(this.dbLogsBuffer[port].logs)}`);
    }
  }

  saveLogs = (onStopLogs = false) => {
    // console.log(`on sniffer saveLogs`);
    const actualTime = new Date().getTime();
    if (onStopLogs || actualTime - this.dbLastSaveTime > this.dbLogsBufferTimer) {
      const ports = Object.keys(this.dbLogsBuffer);
      for (let i = 0; i < ports.length; i++) {
        const key = ports[i];
        const port = this.dbLogsBuffer[key];
        // console.log(`on sniffer saveLogs, saved the logs`);
        // console.log(`portBrickName = ${JSON.stringify(portBrickName)}`);
        // console.log(`this.dbLogsBuffer = ${JSON.stringify(this.dbLogsBuffer)}`);
        // console.log(`this.dbLogsBuffer[portBrickName].logs = ${JSON.stringify(this.dbLogsBuffer[portBrickName].logs)}`);
        // console.log(`before splice = ${this.dbLogsBuffer[portBrickName].logs.length}`);
        // const sv = this.dbLogsBuffer[portBrickName].logs.splice(0);
        // console.log(`after splice = ${this.dbLogsBuffer[portBrickName].logs.length}`);
        // console.log(`sv = ${JSON.stringify(sv)}`);
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

        // this.checkDbInfo();
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
