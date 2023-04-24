import db from "../DataBase";


const tableName = "logs";

/**
 * INICIALIZAÇÃO DA TABELA
 * - Executa sempre, mas só cria a tabela caso não exista (primeira execução)
 */
const init = async () => {
  await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ${tableName} (
          value TEXT, 
          time INT, 
          portId INTEGER, 
          CONSTRAINT portId FOREIGN KEY (portId) 
            REFERENCES ports(id) 
            ON DELETE CASCADE);`,
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

const appendLogsOnPort = (logs, portId) => {
  let batchInsertSqlStatement = `INSERT INTO ${tableName} (portId, value, time) values `;
  for (let i = 0; i < logs.length; i++) {
    batchInsertSqlStatement += `(${portId}, ${logs[i].value}, ${logs[i].time}), `;
  }
  batchInsertSqlStatement = batchInsertSqlStatement.slice(0, -2);
  batchInsertSqlStatement += ';';

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        batchInsertSqlStatement,
        [],
        //-----------------------
        (_, { rowsAffected, insertId }) => {
          if (rowsAffected > 0) {
            console.log(`appendLogs(${logs.length}) sucess with insertId = ${insertId}`);
            resolve(insertId);
          }
          else reject(`Error inserting logs: [${(JSON.stringify(logs[0]))} ... ${(JSON.stringify(logs[logs.length - 1]))}]"`); // insert falhou
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
const getLogsFromPortInTimeFrame = ({ begin, end }, portId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        `SELECT * FROM ${tableName} 
          WHERE portId = ${portId} AND
          time BETWEEN ${begin} AND ${end}
          ORDER BY time ASC
          LIMIT 10000;`,
        [],
        //-----------------------
        (_, { rows }) => {
          console.log(`got ${rows._array.length} logs from portId = ${portId} in timeframe ${begin} to ${end} ms`);
          resolve(rows._array);
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

const findLogs = async (portId, { begin, end }) => {
  return await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        `SELECT * FROM ${tableName} WHERE portId = ${portId} AND time BETWEEN ${begin} AND ${end} ORDER BY time ASC LIMIT 10000;`,
        [],
        //-----------------------
        (_, { rows }) => {
          // console.log(`find ${tableName} rows = ${JSON.stringify(rows)}`);
          resolve(rows._array)
        },
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
}

const findLogsBuffer = async (portId, { begin, end }, bufferLimit) => {
  return await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        `SELECT * FROM ${tableName} WHERE portId = ${portId} AND time BETWEEN ${begin} AND ${end} ORDER BY time ASC LIMIT ${bufferLimit};`,
        [],
        //-----------------------
        (_, { rows }) => {
          // console.log(`find ${tableName} rows = ${JSON.stringify(rows)}`);
          resolve(rows._array)
        },
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
}

const findAllLogs = async (portId) => {
  return await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        `SELECT * FROM ${tableName} WHERE portId = ${portId} ORDER BY time ASC;`,
        [],
        //-----------------------
        (_, { rows }) => {
          // console.log(`find ${tableName} rows = ${JSON.stringify(rows)}`);
          resolve(rows._array)
        },
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
}

const remove = async (portId) => {
  return await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        `DELETE FROM ${tableName} WHERE portId=?;`,
        [portId],
        //-----------------------
        (_, { rowsAffected }) => {
          resolve(rowsAffected);
        },
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};

export default {
  tableName,
  findAllLogs,
  findLogsBuffer,
  init,
  deleteAllRecords,
  appendLogsOnPort,
  countRecords,
  getLogsFromPortInTimeFrame,
  findLogs,
  remove
};