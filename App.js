import { Routes } from './src/routes/Context';
import { Provider } from 'mobx-react';
import Stores from './src/stores';
// import 'react-native-gesture-handler';
import RealmDB from './src/database/realm';
import Realm from 'realm';


function App() {
  setTimeout(async () => {
    const LogSchema = {
      name: 'LogSchema',
      properties: {
        _id: 'string',
        value: 'string',
        date: 'string'
      },
      primaryKey: "_id"
    };

    const connection = await Realm.open({
      path: "banco-de-testes-6",
      schema: [LogSchema]
    });

    console.log(`\nconnection opened`);

    connection.write(() => {
      connection.create("LogSchema", {
        _id: `${new Date().getTime()}`,
        value: '255',
        date: 'this is supose to be a date'
      });
    })

    console.log(`\nwrote a log`);
    const result = await connection.objects("LogSchema")[0];
    console.log(`\nfound a log, ${JSON.stringify(result)}`);

    connection.close();

    console.log(`\nclosed connection`);
  }, 3000);

  return (
    <Provider {...Stores}>
      <Routes />
    </Provider>
  );
}

export default App;