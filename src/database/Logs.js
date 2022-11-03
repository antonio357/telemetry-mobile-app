import db from "./DataBase";

const tableName = "logs"; 

/**
 * INICIALIZAÇÃO DA TABELA
 * - Executa sempre, mas só cria a tabela caso não exista (primeira execução)
 */
db.transaction((tx) => {
  //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
  //tx.executeSql("DROP TABLE cars;");
  //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>

  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, value TEXT, time INT);`
  );
});


const appendLogs = (logs) => {
  const initialTime = new Date().getTime();
  let batchInsertSqlStatement = `INSERT INTO ${tableName} (value, time) values `;
  for (let i = 0; i < logs.length; i++) {
    batchInsertSqlStatement += `(${logs[i].value}, ${logs[i].time}), `;
  }
  batchInsertSqlStatement = batchInsertSqlStatement.slice(0, -2);
  batchInsertSqlStatement += ';';

  console.log(`called appendLogs`);
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        batchInsertSqlStatement,
        [],
        //-----------------------
        () => {
          console.log(`saved ${logs.length} in ${(new Date().getTime()) - initialTime} ms`);
          // reject(`Error inserting logs: [${(JSON.stringify(logs[0]))} ... ${(JSON.stringify(logs[logs.length - 1]))}]"`); // insert falhou
        },
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};

/**
 * CRIAÇÃO DE UM NOVO REGISTRO
 * - Recebe um objeto;
 * - Retorna uma Promise:
 *  - O resultado da Promise é o ID do registro (criado por AUTOINCREMENT)
 *  - Pode retornar erro (reject) caso exista erro no SQL ou nos parâmetros.
 */
const create = (log) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        `INSERT INTO ${tableName} (value, time) values (?, ?);`,
        [log.value, log.time],
        //-----------------------
        (_, { rowsAffected, insertId }) => {
          if (rowsAffected > 0) resolve(insertId);
          else reject("Error inserting log: " + JSON.stringify(log)); // insert falhou
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
        (_, { rows }) => resolve(rows._array),
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

const countRecords = () => {
  return new Promise((resolve, reject) => {
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
  create,
  deleteAllRecords,
  appendLogs,
  countRecords,
};