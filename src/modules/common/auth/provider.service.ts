import { AuthConfigService } from '@config/auth/config.provider';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AUTH } from '@utils/constant';
import { DateTime } from 'luxon';
import * as crypto from 'crypto';
import * as fs from 'fs';
import { Store } from 'cache-manager';
import { CacheConfigModule } from '@config/cache/config.module';

@Injectable()
export class AuthProvider {
  private cacheStore: Store;

  constructor(
    private readonly authConfigService: AuthConfigService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.cacheStore = CacheConfigModule.store;
  }

  /**
   * get token
   * @param param0
   * @returns Promise<{ expiresIn: number; token: string }>
   */
  async createToken(
    {
      payload,
      key,
      audience,
    }: {
      payload: { userId: number; userLoginId: number; username: string } | any;
      key: string;
      audience: string;
    },
    {
      expiresIn = this.authConfigService.defaultExpireTime,
      issuer = this.configService.get('app.name'),
      expirationType = 'second',
    }
    : {
      expiresIn?: number;
      issuer?: string;
      expirationType?: 'day' | 'second' | 'minute' | 'hour' | 'year';
    } = {},
  ): Promise<{ expiresIn: number; token: string }> {
    const { algorithm } = this.authConfigService;
    // const payloadJson = circularToJSON(payload);
    const expirationTime = `${expiresIn} ${expirationType}`;
    // const sessionPayload = this.sessionPayload(audience, payload);
    // const sid = await hash(sessionPayload, 8);
    const epochExpired = DateTime.now().plus({ [expirationType || 'second']: expiresIn }).toUnixInteger();
    const token = this.jwtService.sign(
      payload,
      {
        secret: this.getKeyFile(key) as any,
        algorithm: algorithm as any,
        audience,
        expiresIn: expirationTime,
        issuer: issuer || this.configService.get('app.name'),
      },
    );

    return { expiresIn: epochExpired, token };
  }

  /**
   * encrypt data based on auth config
   * @param text
   * @returns
   */
  encrypt(text: string): string {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const key = crypto.scryptSync(
        AUTH.PAYLOAD_PASSWORD,
        AUTH.PAYLOAD_SALT,
        AUTH.PAYLOAD_SALT_ROUND,
      );

      const iv = Buffer.alloc(16, 0); // Initialization vector.
      const cipher = crypto.createCipheriv(AUTH.PAYLOAD_ALGORITHM, key, iv);

      return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  /**
   * get key of auth
   * @param filename
   * @returns
   */
  getKeyFile(filename: string): Buffer {
    const fileRoute = this.authConfigService.keyFolderPath;
    const filePath = `${fileRoute}${filename}`;

    if (!fs.existsSync(filePath)) {
      throw new InternalServerErrorException('file secret not found');
    }

    return fs.readFileSync(filePath);
  }

  sessionPayload(
    audience: string,
    {
      userId,
      username,
      userLoginId,
    }: { userId: number; username: string; userLoginId: number },
  ): string {
    const appName = this.configService.get('app.name');
    return `${appName}${audience}${userId}${username}${userLoginId}`;
  }

  // /**
  //  * get cachedToken Data from cache or from mongo
  //  * @param param0
  //  * @param options
  //  * @returns
  //  */
  // async findTokenCache(
  //   userId: number,
  //   token: string,
  //   options?: { key?: string, ttl?: number },
  // ) {
  //   const ONE_MINUTE = 60;
  //   const TTL = options?.key || ONE_MINUTE;
  //   const key = options?.key || token?.split('.')?.[1];

  //   if (!key) return null;

  //   const cachedToken = await this.cacheStore.get(key);

  //   if (cachedToken) return JSON.parse(cachedToken as any);

  //   const userToken = await this.userTokenModel.findOne({
  //     userId,
  //     token,
  //   });

  //   if (!userToken) return null;

  //   this.cacheStore.set(key, JSON.stringify(userToken), { ttl: TTL });

  //   return userToken;
  // }
}
