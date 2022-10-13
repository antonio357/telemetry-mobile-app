import { Routes } from './src/routes/Context';
import { Provider } from 'mobx-react';
import Stores from './src/stores';
import 'react-native-gesture-handler';
import {DataBaseOperations} from './src/databases/DataBaseOperations';
import { tableSchema } from '@nozbe/watermelondb';
import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';
import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { appSchema } from '@nozbe/watermelondb';

// const tabela = tableSchema({
//   name: 'tabela',
//   columns: [
//     {
//       name: 'value',
//       type: 'string',
//     }
//   ]
// });

// const schemas = appSchema({
//   version: 1, // tem que ser maior que 0
//   tables: [tabela]
// });

// class TestModel extends Model {
//   static table = 'tabela';

//   @field('value') value;
// }

// const adapter = new SQLiteAdapter({
//   schema: schemas
// });

// const database = new Database({
//   adapter,
//   modelClasses: [TestModel]
// });

// await database.write(async () => {
//   await database.get('tabela')
//     .create(data => {
//       data.value = 'SimpleShema_value'
//     });
// });

// const SimpleCollection = database.get('tabela');
// const response = await SimpleCollection.query().fetch();
// console.log(`response = ${JSON.stringify(response)}`);

function App() {
  const database = new DataBaseOperations();
  database.saveTest();
  database.getTest();

  return (
    <Provider {...Stores}>
      <Routes />
    </Provider>
  );
}

export default App;