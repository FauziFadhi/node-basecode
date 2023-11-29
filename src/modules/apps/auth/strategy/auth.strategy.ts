import { AuthConfigService } from '@config/auth/config.provider';
import { UserLogin } from '@models/core/UserLogin';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AUTH } from '@utils/constant';
import { AuthProvider } from '@_common/auth/provider.service';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { readFileSync } from 'fs';
import { ILoggedUser } from '../interface/logged-user.interface';
import { ILoginPayload } from '../interface/login.interface';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy, 'auth') {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly authConfig: AuthConfigService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: authConfig.algorithm,
      audience: authProvider.encrypt(AUTH.AUDIENCE_APP),
      issuer: configService.get('app.name'),
      secretOrKey: readFileSync(`${authConfig.keyFolderPath}${authConfig.public}`),
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
      userId: userLogin.user.id,
      username: userLogin.username,
    };
  }
}
