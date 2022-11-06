import db from './DataBase';
import Executions from './tables/Executions';
import Sniffers from './tables/Sniffers';
import Ports from './tables/Ports';
import Logs from './tables/Logs';


const tables = [Executions, Sniffers, Ports, Logs];

const clearTables = async () => {
  for (let i = 0; i < tables.length; i++) {
    const tableName = tables[i].tableName;
    await new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `DROP TABLE IF EXISTS ${tableName};`,
          [],
          (_, { rowsAffected, insertId }) => resolve(console.log(`dropped ${tableName} table, rowsAffected = ${rowsAffected}, insertId = ${insertId}`)),
          (_, error) => {
            console.log(`could not drop ${tableName} table`);
            reject(error) // erro interno em tx.executeSql
          }
        );
      });
    });
  }
  console.log(`all data base tables dropped`);
}

const initTables = async (reseting = false) => {
  if (reseting) await clearTables();

  for (let i = 0; i < tables.length; i++) {
    await tables[i].init();
  }
  console.log(`all data base tables inicialized`);
}

const countRecords = async () => {
  const recordsCounting = {};
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    recordsCounting[table.tableName] = await table.countRecords();
  }
  console.log(`recordsCounting = ${JSON.stringify(recordsCounting)}`);
  return recordsCounting;
}

const createExecution = async (execution, sniffers, ports) => {
  const executionInfo = {};
  const executionId = await Executions.create(execution);
  executionInfo['executionId'] = executionId;
  executionInfo['sniffers'] = [];
  for (let i = 0; i < sniffers.length; i++) {
    const sniffer = {
      wsClientUrl: sniffers[i].getUrl(),
      name: sniffers[i].getUrl(),
    };
    const snifferId = await Sniffers.appendSnifferOnExecution(sniffer, executionId);
    executionInfo['sniffers'].push({
      wsClientUrl: sniffer.wsClientUrl,
      id: snifferId,
      portIds: []
    });
    for (let j = 0; j < ports.length; j++) {
      const port = {
        name: ports[j].port,
        sensorName: 'sensor de distância',
        sensorType: 'ultrassonic',
      };
      const portId = await Ports.appendPortOnSniffer(port, snifferId);
      executionInfo['sniffers'][i]['portIds'].push({
        id: portId,
        portName: port.name
      });
    }
  }
  return executionInfo;
}

const findExecution = async (executionId, logsTime = null) => {
  const executionInfo = {};
  const execution = await Executions.findExecution(executionId);
  executionInfo['id'] = execution.id;
  executionInfo['name'] = execution.name;
  executionInfo['initDate'] = execution.initDate;
  executionInfo['initTime'] = execution.initTime;
  executionInfo['endTime'] = execution.endTime;
  executionInfo['sniffers'] = [];
  const sniffers = await Sniffers.findSniffers(executionId);
  for (let i = 0; i < sniffers.length; i++) {
    const sniffer = sniffers[i];
    executionInfo['sniffers'].push({
      id: sniffer.id,
      name: sniffer.name,
      wsClientUrl: sniffer.wsClientUrl,
      ports: []
    });
    const ports = await Ports.findPorts(sniffer.id);
    for (let j = 0; j < ports.length; j++) {
      const port = ports[j];
      executionInfo['sniffers'][i]['ports'].push({
        id: port.id,
        name: port.name,
        sensorName: port.sensorName,
        sensorType: port.sensorType,
      });
      if (logsTime) {
        const begin = logsTime - 5000;
        const end = logsTime + 5000;
        executionInfo['sniffers'][i]['ports'][j]['logs'] = await Logs.findLogs(port.id, { begin, end });
      }
    }
  }
  return executionInfo;
}

export default {
  createExecution,
  countRecords,
  initTables,
  findExecution,
};