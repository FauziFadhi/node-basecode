import { Cache, Model } from 'base-repo';
import sequelize from 'sequelize';
import {
  AllowNull, BeforeCreate, BelongsTo, BelongsToMany, Column, ForeignKey, Table,
} from 'sequelize-typescript';
import { Attributes } from 'sequelize/types';
import { IUnfilledAtt, Optional, RelationAttribute } from 'utils/base-class/base.interface';

import { Role } from './Role';
import { UserLogin } from './UserLogin';
import { UserRole } from './UserRole';

interface IRelation<T = 'attributes'> {
  roles: RelationAttribute<Role, T, 'userId'>[]
  userLogin: RelationAttribute<UserLogin>
}

/**
   * auto generated attributes, cause of that removed from iModelCreate
 */
interface IAutoGeneratedAttr {
  id: number;
  code: string;
}

interface INullableAttr extends IUnfilledAtt, IRelation {
  phone: string;
}

export interface IModel extends
  Optional<INullableAttr>,
  IAutoGeneratedAttr {
  name: string;
  email: string;
  userLoginId: number;
}

export type IModelCreate = Omit<IModel, keyof IAutoGeneratedAttr | keyof IRelation>
& Partial<IAutoGeneratedAttr>
& Partial<IRelation<'creation'>>;

@Cache()
@Table({
  tableName: 'user',
  paranoid: true,
  indexes: [{ fields: ['email'] }],
})
export class User extends Model<IModel, IModelCreate> implements IModel {
  declare id: number;

  @BelongsTo(() => UserLogin)
    userLogin?: Attributes<UserLogin>;

  @AllowNull(false)
  @ForeignKey(() => UserLogin)
  @Column
    userLoginId: number;

  @AllowNull(false)
  @Column
    name: string;

  @AllowNull(false)
  @Column
    email: string;

  @Column
    code: string;

  @Column
    phone: string;

  @BelongsToMany(() => Role, () => UserRole)
    roles: Role[];

  @BeforeCreate
  static async generateCode(model: User, options) {
    model.code = sequelize.literal(`(
      with lastCount as (select count(*) as count from "user")
      select lastCount.count+1 from lastCount
    )`) as any;
  }
}
