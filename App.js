import { Routes } from './src/routes/Context';
import { Provider } from 'mobx-react';
import Stores from './src/stores';
import 'react-native-gesture-handler';
// import Logs from './src/database/Logs';
import DbOperations from './src/database/DbOperations';


setTimeout(async () => {
  await DbOperations.initTables(true); // coloca true para ficar apagando o banco inteiro 
});

function App() {
  return (
    <Provider {...Stores}>
      <Routes />
    </Provider>
  );
}

export default App;