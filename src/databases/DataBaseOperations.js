import { database } from './index';
import { Q } from '@nozbe/watermelondb';


export class DataBaseOperations {
  connection = null;

  constructor() {
    this.connection = database
  }

  // criar o registro da gravação da execução
  createLogsRecord = async () => { }

  // salvar os logs de um registro de gravação de uma execução
  appendLog = async (execution_sensor_port_id, value, time) => {
    let record;
    await this.connection.write(async () => {
      record = await this.connection.get('ExecutionLogs')
        .create(logModal => {
          // logModal.execution_sensor_port_id = execution_sensor_port_id,
          logModal.value = value,
            logModal.time = time
        });
    });
    return record._raw.id;
  }

  // pegar os logs de um registro de de uma execução delimitando ou não uma faixa de tempo 
  getExecutionLogs = async (executionId, requestedTime = null, timeFrame = 10000) => {
    // const executionId = "65kp0bxxrdp30hb3"; // id da gravação de uma execução, do tipo string é gerado automaticamente pelo próprio watermelonDB
    // const requestedTime = 60000; // número inteiro que representa o tempo em ms após o início da gravação sendo este o momento que se deseja analisar, nesse exemplo 1 min após o início da gravação
    // const timeFrame = 10000; // númerot inteiro que representa quanto tempo antes e depois do requestedTime se quer analisar, é dado em ms e nesse caso representa 10s antes e depois

    // obj de retorno com todos os logs separados por portas
    // const executionSniffers = [
    //   {
    //     name: "nome do sniffer",
    //     wsServerUrl: "url do web socket dos logs do sniffer",
    //     executionSensorPorts: [
    //       {
    //         brickPortName: "nome da porta no brick",
    //         sensorType: "tipo de sensor que tava conectado na porta do brick durante a gravação da execução",
    //         sensorName: "nome que o usuário utilisou para aquele sensor durante a gravação da execução",
    //         executionLogs: [
    //           { value: "string qualquer", time: "inteiro tempo em ms após o início da gravação" },
    //           ...
    //         ],
    //       },
    //       ...
    //     ],
    //   },
    //   ...
    // ];
    let executionSniffers = {};


    // buscar todos os sniffers
    // const sniffers = await this.connection.get('ExecutionSniffers').query(
    //   Q.on(, )
    // ).fetch();
    // para cada sniffer buscar todas as portas
    // e para cada porta pegar o array de logs delimitados

    // se não tem faixa de tampo trás todos os logs daquele registro, considerando até 1log/ms 20min de gravação de uma execução pode ter até 1.200.000 de logs
    if (!requestedTime) {
      return await this.connection.get('ExecutionSchema').query().fetch();
    }
    // considerando o time frame padrão de 10s antes de um momento x e 10s segundos após ess momento x, considerando até 1log/ms 20.000 logs para cada sensor
    else {


    }

    return executionSniffers;
  }

  executionToObj = execution => {
    return {
      id: execution.id,
      name: execution.name,
      initDate: execution.initDate,
      initTime: execution.initTime
    }
  };
  executionSnifferToObj = executionSniffer => {
    return {
      id: executionSniffer.id,
      execution_id: executionSniffer.execution_id,
      name: executionSniffer.name,
      wsServerUrl: executionSniffer.wsServerUrl
    }
  };
  executionSensorPortToObj = executionSensorPortRecord => {
    return {
      id: executionSensorPortRecord.id,
      execution_sniffer_id: executionSensorPortRecord.execution_sniffer_id,
      brickPortName: executionSensorPortRecord.brickPortName,
      sensorType: executionSensorPortRecord.sensorType,
      sensorName: executionSensorPortRecord.sensorName,
    }
  };
  executionLogToObj = executionLogRecord => {
    return {
      id: executionLogRecord.id,
      execution_sensor_port_id: executionLogRecord.execution_sensor_port_id,
      value: executionLogRecord.value,
      time: executionLogRecord.time
    }
  };

  createExecution = async (name, initDate, initTime) => {
    let record;
    await this.connection.write(async () => {
      record = await this.connection.get('Executions')
        .create(executionModal => {
          executionModal.name = name,
            executionModal.initDate = initDate,
            executionModal.initTime = initTime
        });
    });
    return record._raw.id;
  }

  executionToObj = executionRecord => {
    return {
      id: executionRecord.id,
      name: executionRecord.name,
      initDate: executionRecord.initDate,
      initTime: executionRecord.initTime
    }
  };

  getExecution = async (id, convertToJsObj = true) => {
    const record = await this.connection.get('Executions').query(
      Q.where('id', id)
    ).fetch();
    if (convertToJsObj) return this.executionToObj(record[0]._raw);
    else return record[0];
  }

  getAllExecutions = async (convertToJsObj = true) => {
    const records = await this.connection.get('Executions').query().fetch();
    if (convertToJsObj) return records.map(record => this.executionToObj(record._raw));
    else return records;
  }

  appendExecutionSniffer = async (execution_id, name, wsServerUrl) => {
    let record;
    await this.connection.write(async () => {
      record = await this.connection.get('ExecutionSniffers')
        .create(executionModal => {
          // executionModal.execution_id = execution_id,
          executionModal.name = name,
            executionModal.wsServerUrl = wsServerUrl
        });
    });
    return record._raw.id;
  }

  executionSnifferToObj = executionSnifferRecord => {
    return {
      id: executionSnifferRecord.id,
      execution_id: executionSnifferRecord.execution_id,
      name: executionSnifferRecord.name,
      wsServerUrl: executionSnifferRecord.wsServerUrl
    }
  };

  getExecutionSniffer = async (id, convertToJsObj = true) => {
    const records = await this.connection.get('ExecutionSniffers').query(
      Q.where('id', id)
    ).fetch();
    if (convertToJsObj) return records.map(record => this.executionSnifferToObj(record._raw));
    else return records;
  }

  getSniffersFromExecution = async (execution_id, convertToJsObj = true) => {
    const records = await this.connection.get('ExecutionSniffers').query(
      Q.where('execution_id', execution_id)
    ).fetch();
    if (convertToJsObj) return records.map(record => this.executionSnifferToObj(record._raw));
    else return records;
  }

  getPortsFromExecutionSniffer = async (execution_sniffer_id, convertToJsObj = true) => {
    const records = await this.connection.get('ExecutionSensorPorts').query(
      Q.where('execution_sniffer_id', execution_sniffer_id)
    ).fetch();
    if (convertToJsObj) return records.map(record => this.executionSensorPortToObj(record._raw));
    else return records;
  }

  appendExecutionSensorPort = async (execution_sniffer_id, brickPortName, sensorType, sensorName) => {
    let record;
    await this.connection.write(async () => {
      record = await this.connection.get('ExecutionSensorPorts')
        .create(executionModal => {
          // executionModal.execution_sniffer_id = execution_sniffer_id,
          executionModal.brickPortName = brickPortName,
            executionModal.sensorType = sensorType,
            executionModal.sensorName = sensorName
        });
    });
    return record._raw.id;
  }

  getLogsFromExecutionSnifferPort = async (execution_sensor_port_id, timeFrame = null, convertToJsObj = true) => {
    let records;
    if (timeFrame) {
      const { begin, end } = timeFrame;
      records = await this.connection.get('ExecutionSensorPorts').query(
        Q.where('execution_sensor_port_id', execution_sensor_port_id),
        Q.where('value', Q.between(begin, end))
      ).fetch();
    } else {
      records = await this.connection.get('ExecutionSensorPorts').query(
        Q.where('execution_sensor_port_id', execution_sensor_port_id)
      ).fetch();
    }
    if (convertToJsObj) return records.map(record => this.executionLogToObj(record._raw));
    else return records;
  }

  deleteExecution = async (id) => {
    const execution = await this.getExecution(id, false);
    console.log(`got execution =${Object.keys(execution)}`);
    await this.connection.write(async () => {
      await execution.destroyPermanently();
    })
  }

  deleteAllExecutions = async () => {
    const executions = await this.getAllExecutions();
    await executions.map(execution => this.deleteExecution(execution.id));
  }

  countRecords = async () => {
    let tablesCount = {
      Executions: 0,
      ExecutionSniffers: 0,
      ExecutionSensorPorts: 0,
      ExecutionLogs: 0
    }
    const keys = Object.keys(tablesCount);
    for (let i = 0; i < keys.length; i++) {
      tablesCount[keys[i]] = await this.connection.get(`${keys[i]}`).query().fetchCount();
    }
    return tablesCount;
  }
}

/*
// cada um é uma tabela diferente
const execution = {
  id: "próprio gerado pelo watermelonDB",
  name: "nome da gravação da execução",
  initDate: "data em que a gravação da execução ocorreu segue o formato yyyy-mm-dd", 
  initTime: "tempo em que a gravação da execução começou segue o formato hh:mm:ss:msmsms"
}

const executionSniffer = {
  id: "próprio gerado pelo watermelonDB",
  execution: "chave estrangeira referente ao id da gravação da execução",
  name: "nome do sniffer durante a gravação da execução",
  wsServerUrl: "url do socket para comunicação do canal de logs durante a gravação da execução",
}

const executionSensorPort = {
  id: "próprio gerado pelo watermelonDB",
  executionSniffer: "chave estrangeira referente ao id do estado do sniffer durante uma certa gravação",
  brickPortName: "nome da porta no brick",
  sensorType: "tipo de sensor que tava conectado na porta do brick durante a gravação da execução",
  sensorName: "nome que o usuário utilisou para aquele sensor durante a gravação da execução",
}

const executionLog = {
  id: "próprio gerado pelo watermelonDB",
  executionSensorPort: "chave estrangeira referente ao id do estado da porta do sensor configurada durante uma certa gravação",
  value: "valor do log, que vai ser uma string genérica que será interpretada de acordo com o tipo do sensor de executionSensorPort",
  time: "tempo em ms desde o tempo de início da grvação da execução"
}
*/