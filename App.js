import { Routes } from './src/routes/Context';
import { Provider } from 'mobx-react';
import Stores from './src/stores';
import 'react-native-gesture-handler';


function App() {
  return (
    <Provider {...Stores}>
      <Routes />
    </Provider>
  );
}

export default App;
