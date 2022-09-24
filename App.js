import { Routes } from './src/routes/Context';
import { Provider } from 'mobx-react';
// import Stores from './src/stores';
import Stores from './src/testing_mobx/Stores.store';
import Observer from './src/testing_mobx/Observer';
import 'react-native-gesture-handler';


function App() {
  return (
    <Provider {...Stores}>
      {/* <Routes /> */}
      <Observer />
    </Provider>
  );
}

export default App;
