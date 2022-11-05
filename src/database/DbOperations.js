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

const createExecution = () => { }

const countRecords = async () => {
  const recordsCounting = {};
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    recordsCounting[table.tableName] = await table.countRecords();
  }
  console.log(`recordsCounting = ${JSON.stringify(recordsCounting)}`);
  return recordsCounting;
}


export default {
  createExecution,
  countRecords,
  initTables,
};
