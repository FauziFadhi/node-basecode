import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { BaseFilter } from '@utils/base-class/base.filter';
import sequelize, { FindOptions, Op } from 'sequelize';
import { ListRequestNameQuery } from './request';
import { ModelName } from './model';

export const FilterName = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): FindOptions => {
    const request = ctx.switchToHttp().getRequest();

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return new Filter(request.query);
  },
);

class Filter extends BaseFilter<ModelName> {
  constructor(query: ListRequestNameQuery) {
    super(query);

    this.orderByName();

    if (this.query.search) { this.search(this.query.search); }
  }

  orderById() {
    this.order = [...this.order as [], ['id', 'asc']];
    return this;
  }

  orderByName() {
    this.order = [...this.order as [], ['name', 'asc']];
    return this;
  }

  search(search: string) {
    this.where = {
      ...this.where,
      [Op.or]: [
        sequelize.where(sequelize.col('name'), {
          [Op.iLike]: `%${search.toLowerCase()}%`,
        }),
      ],
    };
    return this;
  }
}
