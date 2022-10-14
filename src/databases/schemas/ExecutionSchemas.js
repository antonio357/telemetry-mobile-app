import { tableSchema } from '@nozbe/watermelondb';


export const Executions = tableSchema({
  name: 'Executions',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'initDate', type: 'string' },
    { name: 'initTime', type: 'string' }
  ]
});

export const ExecutionSniffers = tableSchema({
  name: 'ExecutionSniffers',
  columns: [
    {name: 'execution_id', type: 'string'},
    {name: 'name', type: 'string'},
    {name: 'wsServerUrl', type: 'string'},
  ]
});

export const ExecutionSensorPorts = tableSchema({
  name: 'ExecutionSensorPorts',
  columns: [
    {name: 'execution_sniffer_id', type: 'string'},
    {name: 'brickPortName', type: 'string'},
    {name: 'sensorType', type: 'string'},
    {name: 'sensorName', type: 'string'},
  ]
});

export const ExecutionLogs = tableSchema({
  name: 'ExecutionLogs',
  columns: [
    {name: 'execution_sensor_port_id', type: 'string'},
    {name: 'value', type: 'string'},
    {name: 'time', type: 'number'}
  ]
});
