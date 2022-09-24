import { Button, View, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import { styles } from '../../App.styles';

function Observer({ ObservableStore }) {
  const { counter, add } = ObservableStore;

  return (
    <View style={styles.view}>
      <Text>counter = {counter}</Text>
      <Button onPress={add} title='count' />
    </View>
  );
}

export default inject('ObservableStore')(observer(Observer));
