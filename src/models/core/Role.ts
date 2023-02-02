import { Cache, Model } from 'base-repo';
import {
  AllowNull, Column, Table,
} from 'sequelize-typescript';
import { IUnfilledAtt, Optional } from '@utils/base-class/base.interface';

type INullableAttr = IUnfilledAtt;

/**
   * auto generated attributes, cause of that removed from iModelCreate
 */
interface IAutoGeneratedAttr {
  id: number;
}

export interface IModel extends Optional<INullableAttr>, IAutoGeneratedAttr {
  name: string;
}

export type IModelCreate = Omit<IModel, keyof IAutoGeneratedAttr> & Partial<IAutoGeneratedAttr>;

@Cache()
@Table({
  tableName: 'role',
  paranoid: true,
  indexes: [{ fields: ['name'], where: { deleted_at: null } }],
})
export class Role extends Model<IModel, IModelCreate> implements IModel {
  declare id: number;

  @AllowNull(false)
  @Column
    name: string;
}
