import { Text, View, Button } from "react-native";
import { observer, inject } from "mobx-react";
import { styles } from "./RegisteredSniffer.styles";
import { Ionicons } from '@expo/vector-icons';


function RegisteredSniffer({ name, url, WsClientStore }) {
  // const wsClient = new WsClientStore(name, url);
  const { connectionStatus, connect, disconnect } = WsClientStore;
  const statusColor = {
    "desconectado": "#666666",
    "conectado": "#8FF399",
  }[connectionStatus];

  return (
    <View style={[styles.card, styles.shadowProp]}>
      <Text style={[styles.heading, styles.font]}>Sniffer {name || url}</Text>
      <View style={styles.statusContainer}>
        <Ionicons style={styles.statusComponent} name="ios-hardware-chip-sharp" size={24} color={statusColor} />
        <Text style={[styles.font]}>{connectionStatus}</Text>
      </View>
      <View style={styles.buttons}>
        <Button style={styles.button} onPress={connect} title='Conectar' />
        <Button style={styles.button} onPress={disconnect} title='Desconectar' />
      </View>
    </View>
  );
}

export default inject('WsClientStore')(observer(RegisteredSniffer));
