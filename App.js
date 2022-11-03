import { Routes } from './src/routes/Context';
import { Provider } from 'mobx-react';
import Stores from './src/stores';
import 'react-native-gesture-handler';
import Logs from './src/database/Logs';


setTimeout(async () => {
  await Logs.deleteAllRecords();

  const logs = [];
  const quantLogs = 10000;
  for (let i = 0; i < quantLogs; i++) {
    logs.push({ value: `${parseInt(Math.random() * 2551) / 10}`, time: 500 })
  }
  const initialTime = new Date().getTime();
  await Logs.appendLogs(logs);

  console.log(`after ${(new Date().getTime()) - initialTime} ms inserting ${quantLogs} logs, logs table has ${await Logs.countRecords()} records`);
});

function App() {
  return (
    <Provider {...Stores}>
      <Routes />
    </Provider>
  );
}

export default App;