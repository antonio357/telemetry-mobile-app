import { Routes } from './src/routes/Context';
import { Provider } from 'mobx-react';
import Stores from './src/stores';
import 'react-native-gesture-handler';
import { DataBaseOperations } from './src/databases/DataBaseOperations';


setTimeout(async () => {
  const database = new DataBaseOperations();
  const executionId = await database.createExecution('this is a test', '2022-02-02', '14:30:15:500');
  const snifferId = await database.appendExecutionSniffer(executionId, 'sniffer de teste', 'ws://123.123.123.123:81');
  const portId = await database.appendExecutionSensorPort(snifferId, 'port1', 'ultrassonic', 'sensor de distância');
  // await database.appendLog(portId, '125', '500');
  console.log(`records before clean ${JSON.stringify(await database.countRecords())}`);
  setTimeout(async () => {
    await database.deleteAllExecutions(); // ta com um possível problema
    setTimeout(async () => {
      console.log(`records after clean ${JSON.stringify(await database.countRecords())}`);
    }, 1000);
  }, 1000);
}, 1000);

function App() {
  return (
    <Provider {...Stores}>
      <Routes />
    </Provider>
  );
}

export default App;