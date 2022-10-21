import { Routes } from './src/routes/Context';
import { Provider } from 'mobx-react';
import Stores from './src/stores';
import 'react-native-gesture-handler';
import { DataBaseOperations } from './src/databases/DataBaseOperations';


setTimeout(async () => {
  const database = new DataBaseOperations();
  setTimeout(async () => {
    const executionId = await database.createExecution('test', 'test', 'test');
    const snifferId = await database.appendExecutionSniffer(executionId, 'test', 'test');
    const portId = await database.appendExecutionSensorPort(snifferId, 'test', 'test');
    await database.appendLog(portId, 'test', 500);
    console.log('created logs');
  }, 1000);
  setTimeout(async () => {
    const records = await database.countRecords();
    console.log(`records = ${JSON.stringify(records)}`);
  }, 2000);
  setTimeout(async () => {
    await database.deleteAllExecutions();
    console.log('deleted logs');
  }, 3000);
  setTimeout(async () => {
    const records = await database.countRecords();
    console.log(`records = ${JSON.stringify(records)}`);
  }, 4000);
}, 1000);

function App() {
  return (
    <Provider {...Stores}>
      <Routes />
    </Provider>
  );
}

export default App;