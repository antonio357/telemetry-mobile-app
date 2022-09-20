import { TouchableOpacity } from 'react-native';
import { StyleSheet } from "react-native";

import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './RoutesMenu.styles';


export function RoutesMenu({ open }) {
  return (
    <TouchableOpacity
      style={styles.touchableOpacity}
      onPress={open}
    >
      <MaterialIcons name="menu" size={24} color={'black'} />
    </TouchableOpacity>
  )
}
