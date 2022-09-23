import { Text, View, Button } from "react-native";
import { styles } from "./Sniffer.styles";
import { Ionicons } from '@expo/vector-icons';

export function RegisteredSniffer({ name, url, status }) {
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
        <Button style={styles.button}
          title='Conectar' />
        <Button style={styles.button}
          title='Desconectar' />
      </View>
    </View>
    //     <View style={[styles.card, styles.shadowProp]}>  
    //     <View>  
    //       <Text style={styles.heading}>  
    //         React Native Box Shadow (Shadow Props)  
    //       </Text>  
    //     </View>  
    //     <Text>  
    // Using the elevation style prop to apply box-shadow for iOS devices  
    //     </Text>  
    //   </View>  
  );
}