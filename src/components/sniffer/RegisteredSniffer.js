import { useState } from 'react';
import { Text, View, Button } from "react-native";
import { styles } from "./RegisteredSniffer.styles";
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { DataBaseOperations } from '../../databases/DataBaseOperations';


function DefineSensor({ url, portName, sensorType, zIndex, setSensorType }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(sensorType);
  const [items, setItems] = useState([
    { label: 'undefined', value: undefined },
    { label: 'touch', value: 'touch' },
    { label: 'ultrasonic', value: 'ultrasonic' }
  ]);

  return (
    <View>
      <Text>{portName}</Text>
      <DropDownPicker
        placeholder={'Define sensor type'}
        zIndex={zIndex}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        onChangeValue={value => setSensorType(url, portName, value)}
      />
    </View>
  );
}

const database = new DataBaseOperations();
database.saveTest('this is an value for test', 'this is a time for test');

function RegisteredSniffer({ name, url, status, connect, disconnect, sensors, setSensorType }) {
  const statusColor = {
    "desconectado": "#666666",
    "conectado": "#8FF399",
  }[status];

  let counter = sensors.length + 1;

  setTimeout(async () => {
    // const here = await database.getTest();
    // console.log(here[here.length - 1]);
    // console.log(here[here.length - 1]._raw);

    database.testAll();
  }, 1000)

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
          {sensors.length > 0 && sensors.map(port => {
            counter -= 1;
            const definition = { url, ...port, zIndex: counter, setSensorType: setSensorType };
            return <DefineSensor key={port.portName} {...definition} />
          })}
        </View>
      )}
    </View>
  );
}

export default RegisteredSniffer;
