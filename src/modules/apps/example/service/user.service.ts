import { Role } from '@models/core/Role';
import { User } from '@models/core/User';
import { UserLogin } from '@models/core/UserLogin';
import { UserRole } from '@models/core/UserRole';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { AuthService } from './auth.service';
import { ICreateUserDTO } from './interface/user.interface';

@Injectable()
export class UserService {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly authService: AuthService,
  ) {}

  async createUser(dto: ICreateUserDTO, transaction1?: Transaction) {
    return this.sequelize.transaction(
      { transaction: transaction1 },
      async (transaction) => {
        const hashedPassword = await this.authService.hashPassword(dto.password);

        const userLogin = await UserLogin.create({
          username: dto.username,
          password: hashedPassword,
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
    const user = await User.findOne({
      // ttl: 30,
      rejectOnEmpty: new BadRequestException(),
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
