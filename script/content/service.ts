import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptions, InferAttributes } from 'sequelize';
import { ModelName } from './model';

@Injectable()
export class ServiceName {
  async paginate(
    filter: FindOptions<ModelName>,
  ): Promise<{ rows: InferAttributes<ModelName>[]; count: number }> {
    const { rows, count } = await ModelName.findAndCountAll(filter);

    return {
      rows,
      count,
    };
  }

  /**
   *
   * @returns
   */
  async get(): Promise<InferAttributes<ModelName>[]> {
    return ModelName.findAll();
  }

  async getOne(modelId: number) {
    return ModelName.findOne({
      where: { id: modelId },
      rejectOnEmpty: new NotFoundException('data not found.'),
    });
  }

  async create(dto: any): Promise<InferAttributes<ModelName>> {
    return ModelName.create(dto).catch((e) => ModelName.constraintError(e));
  }

  async update(modelId: number, dto: any): Promise<void> {
    await ModelName.update(dto, {
      where: { id: modelId },
    }).catch((e) => ModelName.constraintError(e));
  }

  async bulkDelete(modelIds: number[]): Promise<void> {
    await ModelName.destroy({
      where: { id: modelIds },
    });
  }
}
