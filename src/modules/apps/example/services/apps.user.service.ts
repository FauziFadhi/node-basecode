import { User } from '@models/core/User';
import { UserLogin } from '@models/core/UserLogin';
import { UserRole } from '@models/core/UserRole';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ICreateUserDTO } from './interfaces/apps.user.interface';
import { AppsExampleAuthService } from './apps.example-auth.service';

@Injectable()
export class AppsUserService {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly authService: AppsExampleAuthService,
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

  async getUser(userId: number): Promise<User> {
    const user = await User.findOne({
      // ttl: 30,
      rejectOnEmpty: new BadRequestException(),
      where: {
        id: userId,
      },
    });

    return user;
  }
}
