import { Text, View, Button } from "react-native";
import { styles } from "./Sniffer.styles";
import { Ionicons } from '@expo/vector-icons';
// import Stores from '../../stores/';
import WsSocket from './wsSocket';


export function RegisteredSniffer({ name, url, status }) {
  const store = new WsSocket('this is and id', 'ws://192.168.1.199:81');
  const statusColor = {
    "desconectado": "#666666",
    "conectado": "#8FF399",
  }[status];

  return (
    <View style={[styles.card, styles.shadowProp]}>
      <Text style={[styles.heading, styles.font]}>
        Sniffer {name || url}
      </Text>
      <View style={styles.statusContainer}>
        <Ionicons style={styles.statusComponent} name="ios-hardware-chip-sharp" size={24} color={statusColor} />
        <Text style={[styles.font]}>{status}</Text>
      </View>
      <View style={styles.buttons}>
        <Button style={styles.button} onPress={() => store.connect()}
          title='Conectar' />
        <Button style={styles.button} onPress={() => store.disconnect()}
          title='Desconectar' />
      </View>
    </View>
  );
}