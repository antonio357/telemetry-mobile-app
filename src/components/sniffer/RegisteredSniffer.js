import { Text, View, Button } from "react-native";
import { styles } from "./RegisteredSniffer.styles";
import { Ionicons } from '@expo/vector-icons';


function RegisteredSniffer({name, url, status, connect, disconnect}) {
  const statusColor = {
    "desconectado": "#666666",
    "conectado": "#8FF399",
  }[status];

  return (
    <View style={[styles.card, styles.shadowProp]}>
      <Text style={[styles.heading, styles.font]}>Sniffer {name || url}</Text>
      <View style={styles.statusContainer}>
        <Ionicons style={styles.statusComponent} name="ios-hardware-chip-sharp" size={24} color={statusColor} />
        <Text style={[styles.font]}>{status}</Text>
      </View>
      <View style={styles.buttons}>
        <Button style={styles.button} onPress={() => connect(url)} title='Conectar' />
        <Button style={styles.button} onPress={() => disconnect(url)} title='Desconectar' />
      </View>
    </View>
  );
}

export default RegisteredSniffer;
