import Realm from 'realm';
import { LogSchema, SensorLogsSchema } from './schemas/LogSchemas';


class RealmDB {
  constructor() {
    this.Connection = null; // to keep connection alive
  }

  getRealm = async () => await Realm.open({
    path: "sensors-telemetry", // nome do banco de dados
    schema: [
      LogSchema,
      SensorLogsSchema
    ],
  }).then(() => console.log(`DataBase avaliable`));

  setConnection = async () => {
    if (!this.Connection) {
      try {
        this.Connection = await this.getRealm();
      } catch (error) {
        console.error(`Could not set DataBase Connection due to error = ${error}`);
      }
    }
  }

  createLogsRegister = async (wsClientUrl, portsName, date, initTimestamp) => {
    const id = `${wsClientUrl}+${portsName}+${date}+${initTimestamp}`;
    try {
      this.Connection.create("SensorLogs", {
        _id: id,
        wsClientUrl: wsClientUrl,
        portsName: portsName,
        date: date,
        initTimestamp: initTimestamp,
        logs: []
      });
    } catch (error) {
      console.error(`Could not create SensorLogs due to error = ${error}`);
    }
  }

  appendSensorLogs = async (wsClientUrl, portName, date, initTimestamp, logs) => {
    try {
      const sensorLogs = await this.getSensorLogs(wsClientUrl, portName, date, initTimestamp);
      this.Connection.write(() => {
        sensorLogs.push(logs);
      })
    } catch (error) {
      console.error(`Could not appendSensorLogs due to error = ${error}`);
    }
  }

  getSensorLogs = async (wsClientUrl, portName, date, initTimestamp) => {
    return await this.Connection
      .objects("SensorLogs")
      .filtered(`wsClientUrl == '${wsClientUrl}'`)
      .filtered(`portName == '${portName}'`)
      .filtered(`date == '${date}'`)
      .filtered(`initTimestamp == '${initTimestamp}'`)[0];
  }

  printSensorLogs = async (wsClientUrl, portName, date, initTimestamp) => {
    try {
      const logs = await this.getSensorLogs(wsClientUrl, portName, date, initTimestamp);
      console.log(`logs = ${logs}`);
    } catch (error) {
      console.error(`Could not print logs due to error = ${error}`);
    }
  }
}

export default RealmDB; // para garantir instancia única do realm db