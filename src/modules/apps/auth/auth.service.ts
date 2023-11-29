import { AuthConfigService } from '@config/auth/config.provider';
import { UserLogin } from '@models/core/UserLogin';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AUTH } from '@utils/constant';
import { compare } from 'bcrypt';
import { AuthProvider } from '@_common/auth/provider.service';

import { ILogin, ILoginPayload } from './interface/login.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly commonAuthProvider: AuthProvider,
    private readonly authConfig: AuthConfigService,
  ) {
    console.log('AuthService');
  }

  /**
   * get Login Token
   * @param {ILogin}
   * @returns
   */
  async login({ username, password }: ILogin): Promise<{ expiresIn: number, token: string }> {
    const userLogin = await UserLogin
      .scopes('active')
      .findOneCache({
        ttl: 1,
        where: {
          username,
        },
        include: [{ association: 'user', required: true }],
        rejectOnEmpty: new UnauthorizedException(),
      });

    const isPasswordSame = compare(password, userLogin.password);
    if (!isPasswordSame) throw new UnauthorizedException();

    const loginPayload: ILoginPayload = {
      userId: userLogin.user.id,
      userLoginId: userLogin.id,
      username: userLogin.username,
    };

    return this.commonAuthProvider.createToken(
      {
        payload: loginPayload,
        key: this.authConfig?.secret || '',
        audience: AUTH.AUDIENCE_APP,
      },
    );
  }
}
