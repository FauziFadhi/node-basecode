import { Attributes, CreationAttributes } from 'sequelize';
import { Model } from 'sequelize-typescript';

export interface IUnfilledAtt {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
export interface IUnfilledNotParanoidAtt {
  createdAt: Date;
  updatedAt: Date;
}

export type Optional<T> = {
  [P in keyof T]?: T[P] | null;
};

export type RelationAttribute<M extends Model, T = 'attributes', ForeignKey extends string = ''> = T extends 'attributes'
  ? Attributes<M>
  : Omit<CreationAttributes<M>, ForeignKey>;

// export type WrapperType<T> = T;
