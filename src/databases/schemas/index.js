import { appSchema } from '@nozbe/watermelondb';
import { Executions, ExecutionSniffers, ExecutionSensorPorts, ExecutionLogs } from './ExecutionSchemas'

export const schemas = appSchema({
  version: 1, // tem que ser maior que 0, mudar essa versão destroi o banco e o refaz do zero
  tables: [
    Executions, 
    ExecutionSniffers, 
    ExecutionSensorPorts, 
    ExecutionLogs
  ]
});
