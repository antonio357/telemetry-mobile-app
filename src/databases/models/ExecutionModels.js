import { Model } from '@nozbe/watermelondb';
import { text, field, relation } from '@nozbe/watermelondb/decorators';


export class ExecutionModal extends Model {
  static table = 'Executions';
  @text('name') name
  @text('initDate') initDate
  @text('initTime') initTime
}

export class ExecutionSnifferModal extends Model {
  static table = 'ExecutionSniffers';
  @relation('Executions', 'id') execution_id
  @text('name') name
  @text('wsServerUrl') wsServerUrl
}

export class ExecutionSensorPortModal extends Model {
  static table = 'ExecutionSensorPorts';
  @relation('ExecutionSniffers', 'id') execution_sniffer_id
  @text('brickPortName') brickPortName
  @text('sensorType') sensorType
  @text('sensorName') sensorName
}

export class ExecutionLogModal extends Model {
  static table = 'ExecutionLogs';
  @relation('ExecutionSensorPorts', 'id') execution_sensor_port_id
  @text('value') value
  @field('time') time
}
