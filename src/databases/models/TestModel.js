import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class TestModel extends Model {
  static table = 'TestSchema';

  @field('value') value;

  @field('time') time;
}