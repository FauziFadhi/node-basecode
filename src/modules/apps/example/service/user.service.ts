import { Role } from '@models/core/Role';
import { User } from '@models/core/User';
import { UserLogin } from '@models/core/UserLogin';
import { UserRole } from '@models/core/UserRole';
import { Injectable } from '@nestjs/common';
import { AUTH } from '@utils/constant';
import { hash } from 'bcrypt';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ICreateUserDTO } from './interface/user.interface';

@Injectable()
export class UserService {
  constructor(private readonly sequelize: Sequelize) {}

  async createUser(dto: ICreateUserDTO, transaction1?: Transaction) {
    return this.sequelize.transaction(
      { transaction: transaction1 },
      async (transaction) => {
        const password = await hash(dto.password, AUTH.PASSWORD_SALT_ROUND);
        const userLogin = await UserLogin.create({
          username: dto.username,
          password,
        }, { transaction });

        const user = await User.create({
          email: dto.email,
          name: dto.name,
          userLoginId: userLogin.id,
        }, { transaction });

        await UserRole.create({ userId: user.id, roleId: dto.roleId }, { transaction });
        return user;
      },
    );
  }

  async getUser(userId: number): Promise<User & { roles: Role[] }> {
    const user = await User.findOneCache({
      ttl: 30,
      where: {
        id: userId,
      },
      include: [
        {
          association: 'roles',
        },
      ],
    });

    return user;
  }
}
