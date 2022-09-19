import { TouchableOpacity } from 'react-native';
import { StyleSheet } from "react-native";

import { MaterialIcons } from '@expo/vector-icons';


const styles = StyleSheet.create({
  touchableOpacity: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    left: 15,
    bottom: 15,
  }
});

export function RoutesMenu({ open }) {
  return (
    <TouchableOpacity
      style={styles.touchableOpacity}
      onPress={open}
    >
      <MaterialIcons name="pages" size={24} color={'black'} />
    </TouchableOpacity>
  )
}
