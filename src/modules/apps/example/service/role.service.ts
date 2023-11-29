import { Role } from '@models/core/Role';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UniqueConstraintError } from 'sequelize';
import { ICreateRoleDTO } from './interface/role.interface';

@Injectable()
export class RoleService {
  async create(dto: ICreateRoleDTO) {
    const role = await Role.create({
      name: dto.name,
    })
      .catch(Role.constraintError);
    // .catch((e) => {
    //   if (e instanceof UniqueConstraintError) {
    //     if ('name' in e.fields) {
    //       throw new BadRequestException('Name must be unique.');
    //     }
    //   }

    //   throw e;
    // });

    return role;
  }
}
