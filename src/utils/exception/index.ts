export * from './base.exception.filter';
export * from './http.exception.filter';
export * from './sequelize.exception.filter';
type MetaDTO = {
  url: string;
  method: string;
};

type Meta = {
  path: string;
  method: string;
  timestamp: string;
};

type ResponseBodyDTO = {
  meta: Meta;
  code?: string;
  message: unknown;
};

export const meta = (request: MetaDTO): Meta => ({
  path: request.url,
  method: request.method,
  timestamp: new Date().toISOString(),
});

export const responseBody = (data: ResponseBodyDTO) => ({
  meta: data.meta,
  code: data.code,
  detail: data.message,
});
