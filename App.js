import { Routes } from './src/routes/Context';
import { Provider } from 'mobx-react';
import Stores from './src/stores';
import 'react-native-gesture-handler';
// import Logs from './src/database/Logs';
import DbOperations from './src/database/DbOperations';


setTimeout(async () => {
  await DbOperations.initTables(true);
  // console.log(`logs table had ${await Logs.countRecords()} records on inicialization`);
  // await Logs.deleteAllRecords();
  // console.log(`logs table has ${await Logs.countRecords()} records after inicialization`);
  // console.log(`logs = ${(await Logs.getAllRecords()).length}`);
  // const logs = [];
  // const quantLogs = 10000;
  // for (let i = 0; i < quantLogs; i++) {
  //   logs.push({ value: `${parseInt(Math.random() * 2551) / 10}`, time: 500 })
  // }
  // const initialTime = new Date().getTime();
  // await Logs.appendLogs(logs);

  // console.log(`after ${(new Date().getTime()) - initialTime} ms inserting ${quantLogs} logs, logs table has ${await Logs.countRecords()} records`);
});

function App() {
  return (
    <Provider {...Stores}>
      <Routes />
    </Provider>
  );
}

export default App;