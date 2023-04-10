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

const updateExecution = async (id, execution) => {
  await Executions.update(id, execution);
}

const findExecution = async (id) => {
  return await Executions.findExecution(id);
}

const removeFromTable = async (tableName, id) => {
  return await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        `DELETE FROM ${tableName} WHERE id=?;`,
        [id],
        //-----------------------
        (_, { rowsAffected }) => {
          resolve(rowsAffected);
        },
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};

const removeExecution = async (id) => {
  const execution = await Executions.findExecution(id);
  const sniffers = await Sniffers.findSniffers(execution.id);
  for (let i = 0; i < sniffers.length; i++) {
    const sniffer = sniffers[i];
    const ports = await Ports.findPorts(sniffer.id);
    for (let j = 0; j < ports.length; j++) {
      const port = ports[j];
      await Logs.remove(port.id);
      await removeFromTable(Ports.tableName, port.id);
    }
    await removeFromTable(Sniffers.tableName, sniffer.id);
  }
  await removeFromTable(Executions.tableName, execution.id);
}

const removeAllTempExecutions = async () => {
  const executions = await Executions.findAllTempExecutions();
  for (let e = 0; e < executions.length; e++) {
    const executionId = executions[e].id;
    const sniffers = await Sniffers.findSniffers(executionId);
    for (let i = 0; i < sniffers.length; i++) {
      const sniffer = sniffers[i];
      const ports = await Ports.findPorts(sniffer.id);
      for (let j = 0; j < ports.length; j++) {
        const port = ports[j];
        await Logs.remove(port.id);
        await removeFromTable(Ports.tableName, port.id);
      }
      await removeFromTable(Sniffers.tableName, sniffer.id);
    }
    await removeFromTable(Executions.tableName, executionId);
  }
  console.log(`removeu todas as execuções temporárias`);
}

const findLastExecutionInfo = async () => {
  return await Executions.findLastExecution();
}

const findExecutionInfo = async (executionId, logsTime = null) => {
  const executionInfo = {};
  const execution = await Executions.findExecution(executionId);
  executionInfo['id'] = execution.id;
  executionInfo['name'] = execution.name;
  executionInfo['initDate'] = execution.initDate;
  executionInfo['initTime'] = execution.initTime;
  executionInfo['endTime'] = execution.endTime;
  executionInfo['videoUri'] = execution.videoUri;
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
        let begin = logsTime - 5000;
        let end = logsTime + 5000;
        if (begin < 0) {
          end += -1 * begin;
          begin = 0;
        }
        executionInfo['sniffers'][i]['ports'][j]['logs'] = await Logs.findLogs(port.id, { begin, end });
      }
    }
  }
  return executionInfo;
}

const appendLogsOnPort = (logs, portId) => {
  Logs.appendLogsOnPort(logs, portId);
}

export default {
  createExecution,
  countRecords,
  initTables,
  findExecutionInfo,
  updateExecution,
  findExecution,
  removeExecution,
  removeAllTempExecutions,
  appendLogsOnPort,
  findLastExecutionInfo
};
