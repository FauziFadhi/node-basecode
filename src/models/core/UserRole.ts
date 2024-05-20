import { AutoInvalidate, Model } from 'base-repo';
import {
 BelongsTo, Column, ForeignKey, PrimaryKey, Table 
} from 'sequelize-typescript';
import { IUnfilledAtt, Optional } from '@utils/base-class/base.interface';

import { Role } from './Role';
import { User } from './User';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface INullableAttr extends IUnfilledAtt {
}

/**
   * auto generated attributes, cause of that removed from iModelCreate
 */
interface IAutoGeneratedAttr {
}

export interface IModel extends Optional<INullableAttr>, IAutoGeneratedAttr {
  userId: number
  roleId: number
}

export type IModelCreate = Omit<IModel, keyof IAutoGeneratedAttr> & Partial<IAutoGeneratedAttr>;

@AutoInvalidate()
@Table({
  tableName: 'user_role',
  timestamps: false,
})
export class UserRole extends Model<IModel, IModelCreate> implements IModel {
  @BelongsTo(() => User)
  declare user: User;

  @PrimaryKey
  @ForeignKey(() => User)
  @Column
  declare userId: number;

  @PrimaryKey
  @ForeignKey(() => Role)
  @Column
  declare roleId: number;

  @BelongsTo(() => Role)
  declare role: Role;
}
