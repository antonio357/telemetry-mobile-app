import { tableSchema } from '@nozbe/watermelondb';


export const TestSchema = tableSchema({
  name: 'TestSchema',
  columns: [
    {
      name: 'value',
      type: 'string',
    },
    {
      name: 'time',
      type: 'string'
    }
  ]
});
