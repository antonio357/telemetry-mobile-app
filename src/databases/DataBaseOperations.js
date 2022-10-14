import { database } from './index';
import { Q } from '@nozbe/watermelondb';


export class DataBaseOperations {
  connection = null;

  constructor() {
    this.connection = database
  }

  saveTest = async (value, time) => {
    await this.connection.write(async () => {
      await this.connection.get('TestSchema')
        .create(TestModel => {
          TestModel.value = value,
            TestModel.time = time
        });
    });
  }

  getTest = async () => {
    const TestCollection = await this.connection.get('TestSchema').query().fetch();
    return TestCollection;
  }

  // criar o registro da gravação da execução
  createLogsRegister = async () => {

  }

  // salvar os logs de um registro de gravação de uma execução
  appendLogs = async () => {

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

    const executionSensorPortToObj = executionSensorPortRegister => {
      return {
        brickPortName: executionSensorPortRegister.brickPortName,
        sensorType: executionSensorPortRegister.sensorType,
        sensorName: executionSensorPortRegister.sensorName,
      }
    };
    const executionLogToObj = executionLogRegister => {
      return {
        value: executionLogRegister.value,
        time: executionLogRegister.time
      }
    };

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

  testAll = async () => {
    // let execution;
    // await this.connection.write(async () => {
    //   execution = await this.connection.get('Executions')
    //     .create(executionModal => {
    //       executionModal.name = 'execução de teste',
    //         executionModal.initDate = '2022-10-01',
    //         executionModal.initTime = '14:30:15:500'
    //     });
    // });
    // const executionId = this.executionToObj(execution._raw).id;


    // // append sniffer
    // await this.connection.write(async () => {
    //   await this.connection.get('ExecutionSniffers')
    //     .create(executionModal => {
    //       executionModal.execution_id = executionId,
    //         executionModal.name = 'execução de teste',
    //         executionModal.wsServerUrl = 'ws://123.123.123.123:81'
    //     });
    // });

    // const sniffers = await this.connection.get('ExecutionSniffers').query(
    //   Q.where('execution_id', executionId)
    // ).fetch();

    // const sniffers = this.executionSnifferToObj(sniffers[0]._raw);

    // console.log(`sniffers = ${sniffers[0]._raw}`);
    // console.log(`sniffers = ${Object.keys(sniffers[0]._raw)}`);
    // console.log(`sniffers = ${Object.values(sniffers[0]._raw)}`);

    const executionId = await this.createExecution('execução de testes', '2022-10-01', '14:30:15:500');
    console.log(`executionId = ${executionId}`);
    await this.appendExecutionSniffer(executionId, 'sniffer de testes', 'ws://123.123.123:81');
    await this.appendExecutionSniffer(executionId, 'sniffer de testes', 'ws://123.123.123:81');
    const sniffers = await this.getExecutionSniffersByExecution(executionId);
    console.log(`sniffer = ${JSON.stringify(sniffers)}`);
  }

  createExecution = async (name, initDate, initTime) => {
    let resgister;
    await this.connection.write(async () => {
      resgister = await this.connection.get('Executions')
        .create(executionModal => {
          executionModal.name = name,
            executionModal.initDate = initDate,
            executionModal.initTime = initTime
        });
    });
    return resgister._raw.id;
  }

  executionToObj = executionRegister => {
    return {
      id: executionRegister.id,
      name: executionRegister.name,
      initDate: executionRegister.initDate,
      initTime: executionRegister.initTime
    }
  };

  getAllExecutions = async () => {
    const resgisters = await this.connection.get('Executions').query().fetch();
    return resgisters.map(resgister => this.executionToObj(resgister._raw));
  }

  appendExecutionSniffer = async (execution_id, name, wsServerUrl) => {
    let resgister;
    await this.connection.write(async () => {
      resgister = await this.connection.get('ExecutionSniffers')
        .create(executionModal => {
          executionModal.execution_id = execution_id,
            executionModal.name = name,
            executionModal.wsServerUrl = wsServerUrl
        });
    });
    return resgister._raw.id;
  }

  executionSnifferToObj = executionSnifferRegister => {
    return {
      id: executionSnifferRegister.id,
      execution_id: executionSnifferRegister.execution_id,
      name: executionSnifferRegister.name,
      wsServerUrl: executionSnifferRegister.wsServerUrl
    }
  };

  getExecutionSniffer = async (id) => {
    const resgisters = await this.connection.get('ExecutionSniffers').query(
      Q.where('id', id)
    ).fetch();
    return resgisters.map(resgister => this.executionSnifferToObj(resgister._raw));
  }

  getExecutionSniffersByExecution = async (execution_id) => {
    const resgisters = await this.connection.get('ExecutionSniffers').query(
      Q.where('execution_id', execution_id)
    ).fetch();
    return resgisters.map(resgister => this.executionSnifferToObj(resgister._raw));
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