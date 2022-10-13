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
}
