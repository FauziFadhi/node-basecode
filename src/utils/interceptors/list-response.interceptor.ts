import { BaseResource, Resource } from '../base-class/base.resource';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { circularToJSON } from '../helper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type Meta = {
  currentRecordCount: number;
  totalRecordCount: number;
  totalPage: number;
  currentPage: number;
  perPage: number;
  startOf: number;
};

@Injectable()
export class ResponsePaginationInterceptor<T>
  implements NestInterceptor<T, any>
{
  serializeName: Resource;

  offset;

  /**
   * @property
   * @type {string}
   * all query inserted when access endpoint
   */
  queryString = '';

  /**
   * endpoint url
   */
  pathname = null;

  /**
   * @property
   * @type {Object}
   * all query inserted when access endpoint
   */
  query = null;

  constructor(serializeName: Resource) {
    this.serializeName = serializeName;
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    this.query = request.query;

    return next.handle().pipe(
      map((resp) => {
        const { count, rows, ...additionalMeta } = circularToJSON(resp);

        this.queryString = request._parsedUrl.query || '';
        this.pathname = request._parsedUrl.pathname;

        // make to json serialize
        const resource = new BaseResource(this.serializeName, rows);

        const meta = this.meta(count, rows, additionalMeta);

        return { ...resource, meta, links: this.links(meta) };
      }),
    );
  }

  /**
   * link of response
   * @param param0
   */
  private links({ currentPage, totalPage }: Meta) {
    // LINKS

    const self = () => {
      return this.linkQueries(currentPage);
    };
    const prev = () => {
      const prevPage = +currentPage - 1;
      if (prevPage < 1) return undefined;

      return this.linkQueries(prevPage);
    };
    const next = () => {
      if (+currentPage >= +totalPage) return undefined;

      return this.linkQueries(+currentPage + 1);
    };

    const last = () => {
      if (!+totalPage) return undefined;
      return this.linkQueries(totalPage);
    };

    return {
      self: self(),
      prev: prev(),
      next: next(),
      last: last(),
    };
  }

  private linkQueries(itsPage: number): string {
    const updatedQuery = this.queryString.replace(
      `page=${this.query.page}`,
      `page=${itsPage}`,
    );

    if (!updatedQuery) return this.pathname;
    return `${this.pathname}?${updatedQuery}`;
  }

  /**
   * generate meta of response pagination
   * @param count
   * @param rows
   * @param additionalMeta
   */
  private meta(count, rows: any[], additionalMeta: any): Meta {
    // META
    const total: number =
      typeof count === 'object' ? count?.length || 0 : count;

    const totalPage = Math.ceil(total / (+this.query.size || undefined));

    const offset = this.query.size * this.query.page - +this.query.size || 0;

    return (
      (total >= 0 && {
        totalRecordCount: total,
        currentRecordCount: rows?.length || 0,
        totalPage: totalPage || 0,
        currentPage: +additionalMeta?.meta?.page || +this.query.page || 1,
        perPage: +this.query.size || 0,
        startOf: (count && offset + 1) || 0,
        ...additionalMeta,
      }) ||
      undefined
    );
  }
}
