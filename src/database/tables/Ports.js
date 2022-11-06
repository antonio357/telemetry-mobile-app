import db from "../DataBase";


const tableName = "ports";

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
          sensorName TEXT,
          sensorType TEXT, 
          snifferId INTEGER, 
          CONSTRAINT snifferId FOREIGN KEY (snifferId) 
            REFERENCES sniffers(id) 
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

const appendPortOnSniffer = (port, snifferId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        `INSERT INTO ${tableName} (name, sensorName, sensorType, snifferId) values (?, ?, ?, ?)`,
        [port.name, port.sensorName, port.sensorType, snifferId],
        //-----------------------
        (_, { rowsAffected, insertId }) => {
          if (rowsAffected > 0) {
            console.log(`created port with id = ${insertId}`);
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
const getPortsFromSniffer = snifferId => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        `SELECT * FROM ${tableName} WHERE snifferId = ${snifferId};`,
        [],
        //-----------------------
        (_, { rows }) => {
          console.log(`got ports from snifferId = ${snifferId}`);
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

export default {
  tableName,
  init,
  deleteAllRecords,
  appendPortOnSniffer,
  countRecords,
  getPortsFromSniffer
};