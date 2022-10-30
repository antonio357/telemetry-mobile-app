import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schemas } from './schemas';
import { ExecutionModal, ExecutionSnifferModal, ExecutionSensorPortModal, ExecutionLogModal } from './models/ExecutionModels';


const adapter = new SQLiteAdapter({
  schema: schemas
});

export const adapterTag = adapter._tag;

export const database = new Database({
  adapter,
  modelClasses: [
    ExecutionModal,
    ExecutionSnifferModal,
    ExecutionSensorPortModal,
    ExecutionLogModal
  ]
});
