/* eslint-disable max-classes-per-file */
import { Expose } from 'class-transformer';

export class ViewmodelName {
  @Expose()
    id: number;

  /** @example Rudi Dong */
  @Expose()
    name: string;

  @Expose()
    price: number;
}
