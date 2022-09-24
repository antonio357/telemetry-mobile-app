import { Provider } from 'mobx-react';
import { Observer } from './Observer';
import Stores from './Stores.store';


function App() {
  return (
    <Provider>
      <Observer />
    </Provider>
  );
}

export default App;
