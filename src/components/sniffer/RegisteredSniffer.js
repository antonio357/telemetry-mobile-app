import { useState } from 'react';
import { Text, View, Button } from "react-native";
import { styles } from "./RegisteredSniffer.styles";
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';


function RegisteredSniffer({ name, url, status, connect, disconnect, sensors }) {
  const statusColor = {
    "desconectado": "#666666",
    "conectado": "#8FF399",
  }[status];

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(undefined);
  // const [items, setItems] = useState([
  //   { label: 'undefined', value: undefined },
  //   { label: 'touch', value: 'touch' },
  //   { label: 'ultrasonic', value: 'ultrasonic' }
  // ]);

  const items = [
    { label: 'undefined', value: undefined },
    { label: 'touch', value: 'touch' },
    { label: 'ultrasonic', value: 'ultrasonic' }
  ];

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
      {status == 'conectado' && (
        <View>
          {sensors.length == 0 && (<Text>sniffer has no ports connected</Text>)}
          {sensors.length > 0 && sensors.map(port => (
            <View key={port.portName} styles={styles.container}>
              <Text >{port.portName} {port.sensorType}</Text>
              <DropDownPicker
                placeholder={'Define sensor type'}
                key={port.portName}
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default RegisteredSniffer;
