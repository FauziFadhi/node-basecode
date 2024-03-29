import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { h32 } from 'xxhashjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {

  }

  /**
   *
   * @param key ke that will be used for key of cache. basically u can use arguments that is used for the function
   * @param ttl in second
   * @param setValue return of this clusure will be used as cache value
   *
   * @example
   * const userCached = this.cacheService.getCustomCache({name: 'Fauzi Fadhillah', age: 10 }, 10, () => {
   *   const resp = this.httpService.get('user', {
   *    data: {
   *     name: 'Fauzi Fadhilalh',
   *     age: 10
   *    }
   *   });
   *
   *   return resp.data
   * })
   * @returns
   */
  async getCustomCache<T>(
    key: unknown,
    ttl: number,
    setValue: () => T | Promise<T>,
  ): Promise<T | null> {
    const generatedKey = this.generateKey(key);

    let cacheValue = await this.cacheManager.get(generatedKey);

    if (cacheValue) {
      return JSON.parse(cacheValue as string) as T;
    }

    const value = await setValue();

    if (!value) return null;

    cacheValue = JSON.stringify(value);

    this.cacheManager.set(generatedKey, cacheValue, { ttl });

    return value as T;
  }

  private generateKey(key: unknown) {
    const hash = h32(0xABCD);
    return hash.update(JSON.stringify(key)).digest().toString(16);
  }

  async writeBackCache(key: unknown, ttl: number, value: unknown, storeProcess: (value) => Promise<void>) {
    const generatedKey = this.generateKey(key);
    await this.cacheManager.set(generatedKey, JSON.stringify(value), { ttl });
    await storeProcess(value);
  }
}
