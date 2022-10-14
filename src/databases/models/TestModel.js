import { Model } from '@nozbe/watermelondb';
import { field, text } from '@nozbe/watermelondb/decorators';

export class TestModel extends Model {
  static table = 'TestSchema';

  @text('value') value;

  @text('time') time;
}