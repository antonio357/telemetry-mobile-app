import db from "../DataBase";


const tableName = "executions";

/**
 * INICIALIZAÇÃO DA TABELA
 * - Executa sempre, mas só cria a tabela caso não exista (primeira execução)
 */
const init = async () => {
  await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ${tableName} (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          name TEXT, 
          initDate TEXT, 
          initTime TEXT,
          endTime TEXT,
          videoAsset TEXT);`,
        [],
        (_, { rowsAffected, insertId }) => resolve(console.log(`created ${tableName} table, rowsAffected = ${rowsAffected}, insertId = ${insertId}`)),
        (_, error) => {
          console.log(`could not create ${tableName} table`);
          reject(error) // erro interno em tx.executeSql
        }
      );
    });
  });
}

const create = async (execution) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        `INSERT INTO ${tableName} (name, initDate, initTime, endTime) values (?, ?, ?, ?)`,
        [execution.name, execution.initDate, execution.initTime, ''],
        //-----------------------
        (_, { rowsAffected, insertId }) => {
          if (rowsAffected > 0) {
            console.log(`created execution with id = ${insertId}`);
            resolve(insertId);
          }
          else reject(`Error inserting execution: ${(JSON.stringify(execution))}`); // insert falhou
        },
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};

/**
 * BUSCA TODOS OS REGISTROS DE UMA DETERMINADA TABELA
 * - Não recebe parâmetros;
 * - Retorna uma Promise:
 *  - O resultado da Promise é uma lista (Array) de objetos;
 *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL;
 *  - Pode retornar um array vazio caso não existam registros.
 */
const getAllRecords = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        `SELECT * FROM ${tableName};`,
        [],
        //-----------------------
        (_, { rows }) => {
          const appExecutions = rows._array.map(execution => {
            execution.videoAsset = JSON.parse(execution.videoAsset);
            return execution;
          });
          resolve(appExecutions);
        },
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};

const deleteAllRecords = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        `DELETE FROM ${tableName};`,
        [],
        //-----------------------
        (_, { rowsAffected }) => {
          resolve(rowsAffected);
        },
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};

const countRecords = async () => {
  return await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        `SELECT COUNT(*) FROM ${tableName};`,
        [],
        //-----------------------
        (_, { rows }) => resolve(rows._array[0]["COUNT(*)"]),
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};

const findExecution = async (executionId) => {
  return await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        `SELECT * FROM ${tableName} WHERE id = ${executionId};`,
        [],
        //-----------------------
        (_, { rows }) => {
          console.log(`find ${tableName} rows = ${JSON.stringify(rows)}`);
          const appExecution = rows._array[0];
          appExecution.videoAsset = JSON.parse(appExecution.videoAsset);
          resolve(appExecution);
        },
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
}

const findLastExecution = async (executionId) => {
  return await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        `SELECT * FROM ${tableName} ORDER BY id DESC LIMIT 1;`,
        [],
        //-----------------------
        (_, { rows }) => {
          console.log(`find ${tableName} rows = ${JSON.stringify(rows)}`);
          const appExecution = rows._array[0];
          appExecution.videoAsset = JSON.parse(appExecution.videoAsset);
          resolve(appExecution);
        },
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
}

const findAllTempExecutions = async () => {
  return await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        `SELECT * FROM ${tableName} WHERE videoAsset IS NULL;`,
        [],
        //-----------------------
        (_, { rows }) => {
          console.log(`find ${tableName} rows = ${JSON.stringify(rows)}`);
          const appExecutions = rows._array.map(execution => {
            execution.videoAsset = JSON.parse(execution.videoAsset);
            return execution;
          });
          resolve(appExecutions);
        },
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
}

const update = async (id, execution) => {
  const dbExecution = execution;
  dbExecution.videoAsset = typeof execution.videoAsset === 'string' ? execution.videoAsset : JSON.stringify(execution.videoAsset);
  return await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        `UPDATE ${tableName} SET name=?, initDate=?, initTime=?, endTime=?, videoAsset=? WHERE id=?;`,
        [dbExecution.name, dbExecution.initDate, dbExecution.initTime, dbExecution.endTime, dbExecution.videoAsset, id],
        //-----------------------
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) resolve(rowsAffected);
          else reject(`Error updating execution: id=${id}`); // nenhum registro alterado
        },
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};

export default {
  tableName,
  init,
  deleteAllRecords,
  create,
  countRecords,
  getAllRecords,
  findExecution,
  findLastExecution,
  findAllTempExecutions,
  update,
};