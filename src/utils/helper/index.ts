import { UnprocessableEntityException } from '@nestjs/common';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';
import { FOLDER_COMMON, IMAGE_MIME, IMAGE_URL } from '@utils/constant';
import * as moment from 'moment';

export const circularToJSON = (circular: unknown) => JSON.parse(JSON.stringify(circular));

/**
 * `options.raw` = `true` for using pure object that you provided.
 * `options.raw` = `false` | `undefined` for coverting circular structure to JSON
 * @param cls
 * @param obj
 * @param options
 */
export function transformer<T, V>(
  cls: { new (...args: unknown[]): T },
  obj: V[],
  options?: ClassTransformOptions & { raw?: boolean },
): T[];
export function transformer<T, V>(
  cls: { new (...args: unknown[]): T },
  obj: V,
  options?: ClassTransformOptions & { raw?: boolean },
): T;
export function transformer<T, V>(
  cls: { new (...args: unknown[]): T },
  obj: V | V[],
  options?: ClassTransformOptions & { raw?: boolean },
) {
  const result = plainToInstance(cls, options?.raw ? obj : circularToJSON(obj), {
    excludeExtraneousValues: true,
    exposeUnsetFields: true,
    enableImplicitConversion: true,
    // exposeDefaultValues: true,
    ...options,
  });
  return result as unknown;
}

export const imageFileFilter = (req, file, callback) => {
  if (!IMAGE_MIME.includes(file.mimetype)) {
    return callback(
      new UnprocessableEntityException(
        `file must format image, your mime type file is ${file.mimetype}`,
      ),
      false,
    );
  }

  return callback(null, true);
  // if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
  //   return callback(new Error('Only image files are allowed!'), false);
  // }
  // callback(null, true);
};

export const responseImageUrl = (type: string, image: any) => {
  let result: any = null;
  if (!image) return result;

  switch (type) {
    case FOLDER_COMMON:
      result = `${IMAGE_URL}${FOLDER_COMMON}/${image}`;
      break;
    case FOLDER_COMMON:
      result = `${IMAGE_URL}temp/${FOLDER_COMMON}/${image}`;
      break;
    default:
      result = null;
  }
  return result;
};

// eslint-disable-next-line max-len
export const generateRandomCode = (length: number): string => Math.random().toString(20).substr(2, length);

export const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  let result = '';

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

// eslint-disable-next-line max-len
export const dateNow = (date?: moment.MomentInput, format?: string) => (date ? moment(date, format) : moment());

export function isEmpty(data: any = null): boolean {
  let result = false;
  if (typeof data === 'object') {
    if (JSON.stringify(data) === '{}' || JSON.stringify(data) === '[]') { result = true; }
    if (!data) result = true;
  } else if (typeof data === 'string') {
    if (!data.trim()) result = true;
  } else if (typeof data === 'undefined') {
    result = true;
  }

  return result;
}
