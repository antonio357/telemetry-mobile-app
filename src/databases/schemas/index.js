import { appSchema } from '@nozbe/watermelondb';
import { TestSchema } from './TestSchema';
import { Executions, ExecutionSniffers, ExecutionSensorPorts, ExecutionLogs } from './ExecutionSchemas'

export const schemas = appSchema({
  version: 10, // tem que ser maior que 0, mudar essa versão destroi o banco e o refaz do zero
  tables: [
    TestSchema,
    Executions, 
    ExecutionSniffers, 
    ExecutionSensorPorts, 
    ExecutionLogs
  ]
});
