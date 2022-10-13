import { appSchema } from '@nozbe/watermelondb';
import { TestSchema } from './TestSchema';


export const schemas = appSchema({
  version: 1, // tem que ser maior que 0
  tables: [TestSchema]
});
