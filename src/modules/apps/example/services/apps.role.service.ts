import { Role } from '@models/core/Role';
import { Injectable } from '@nestjs/common';
import { ICreateRoleDTO } from './interfaces/role.interface';

@Injectable()
export class AppsRoleService {
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
