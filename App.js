import { Routes } from './src/routes/Context';
import { Provider } from 'mobx-react';
import Stores from './src/stores';
import 'react-native-gesture-handler';
import { DataBaseOperations } from './src/databases/DataBaseOperations';


setTimeout(async () => {
  const database = new DataBaseOperations();
  const executionId = await database.createExecution('test', 'test', 'test');
  const snifferId = await database.appendExecutionSniffer(executionId, 'test', 'test');
  const portId = await database.appendExecutionSensorPort(snifferId, 'test', 'test');
  await database.appendLog(portId, 'test', 500);
  console.log('created logs');
  const records = await database.countRecords();
  console.log(`records = ${JSON.stringify(records)}`);
  await database.deleteAllExecutions();
  console.log('deleted logs');
  setTimeout(async () => {
    const records = await database.countRecords();
    console.log(`records = ${JSON.stringify(records)}`);
  }, 1000);
}, 1000);

// setTimeout(async () => {
//   const database = new DataBaseOperations();
//   const executionId = await database.createExecution('test', 'test', 'test');
//   const snifferId = await database.appendExecutionSniffer(executionId, 'test', 'test');
//   const portId = await database.appendExecutionSensorPort(snifferId, 'test', 'test');
//   let logs = [];
//   for (let i = 0; i < 500; i++) {
//     logs.push({
//       value: "testing",
//       time: 500
//     });
//   }
//   console.log('creating logs');
//   await database.appendLogs(logs, portId);
//   let records = await database.countRecords();
//   console.log(`records = ${JSON.stringify(records)}`);
//   console.log('deleting all database');
//   await database.deleteAllExecutions();
//   records = await database.countRecords();
//   console.log(`records = ${JSON.stringify(records)}`);
// }, 1000);

function App() {
  return (
    <Provider {...Stores}>
      <Routes />
    </Provider>
  );
}

export default App;