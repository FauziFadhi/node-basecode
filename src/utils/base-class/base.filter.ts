import { queryPaginationSort } from '@utils/helper';
import {
  FindAttributeOptions,
  Includeable,
  Order,
  WhereOptions,
} from 'sequelize/types';

export class BaseFilter {
  where?: WhereOptions;

  include?: Includeable[] = [];

  order?: Order;

  offset?: number;

  having?: WhereOptions;

  attributes?: FindAttributeOptions;

  limit?: number;

  subQuery?: boolean;

  query: any;

  constructor(query: any) {
    this.subQuery = false;

    this.query = query;
    this.offset = (query.size * query.page) - +query.size || undefined;
    this.limit = +query.size || undefined;

    const orders = queryPaginationSort(query.sort, (field) => field) as any;
    this.order = [...orders];
  }
}
