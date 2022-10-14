import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schemas } from './schemas';
import { TestModel } from './models/TestModel';
import { ExecutionModal, ExecutionSnifferModal, ExecutionSensorPortModal, ExecutionLogModal } from './models/ExecutionModels'


const adapter = new SQLiteAdapter({
  schema: schemas
});

export const database = new Database({
  adapter,
  modelClasses: [
    TestModel,
    ExecutionModal,
    ExecutionSnifferModal,
    ExecutionSensorPortModal,
    ExecutionLogModal
  ]
});
