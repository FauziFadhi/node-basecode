import { AuthConfigService } from '@config/auth/config.provider';
import { UserLogin } from '@models/core/UserLogin';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as CONST from '@utils/constant';
import * as fs from 'fs';
import { AuthProvider } from '@_common/auth/provider.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Sequelize } from 'sequelize-typescript';

import { ILoggedUser } from '../interface/logged-user.interface';
import { ILoginPayload } from '../interface/login.interface';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy, 'auth') {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly authConfig: AuthConfigService,
    private readonly configService: ConfigService,
    private readonly sequelize: Sequelize,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: authConfig.algorithm,
      audience: authProvider.encrypt(CONST.AUTH.AUDIENCE_APP),
      issuer: configService.get('app.name'),
      secretOrKey: fs.readFileSync(`${authConfig.keyFolderPath}${authConfig.public}`),
    });
  }

  async validate(payload: ILoginPayload): Promise<ILoggedUser> {
    const userLogin = await UserLogin.scopes('active')
      .findOneCache({
        ttl: 300,
        attributes: ['id', 'username'],
        where: {
          username: payload.username,
        },
        rejectOnEmpty: new UnauthorizedException(),
        include: {
          required: true,
          attributes: ['id'],
          association: 'user',
          include: [
            {
              association: 'roles',
              attributes: ['id', 'name'],
              where: {
                isDeleted: false,
              },
              through: {
                attributes: [],
              },
            },
          ],
        },
      });

    return {
      userLoginId: userLogin.id,
      permissions: [],
      roles: userLogin.user.roles.map(({ name }) => name),
      userId: userLogin.user.id,
      username: userLogin.username,
    };
  }
}
