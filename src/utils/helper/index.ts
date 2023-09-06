import { UnprocessableEntityException } from '@nestjs/common';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';
import { FOLDER_COMMON, IMAGE_MIME, IMAGE_URL } from '@utils/constant';

export const circularToJSON = (circular: unknown) => JSON.parse(JSON.stringify(circular));

/**
 * A description of the entire function.
 *
 * @param {V} cls - The class to be transformed.
 * @param {ConstructorParameters<V>[0]} obj - The object to be transformed.
 * @param {ClassTransformOptions & { raw?: boolean }} options - The transformation options (optional).
 * @return {T} The transformed object.
 */
export function transformer<T, V extends { new (...args: unknown[]): T }>(
  cls: V,
  obj: ConstructorParameters<V>[0] extends undefined ? unknown : ConstructorParameters<V>[0],
  options?: ClassTransformOptions & { raw?: boolean },
): T;
export function transformer<T, V extends { new (...args: unknown[]): T }>(
  cls: V,
  obj: ConstructorParameters<V>[0] extends undefined ? unknown : ConstructorParameters<V>[0][],
  options?: ClassTransformOptions & { raw?: boolean },
): T[];
export function transformer<T, V extends { new (
  ...args: unknown[]): T }>(
  cls: V,
  obj: ConstructorParameters<V>[0] extends undefined ? unknown : (ConstructorParameters<V>[0] | ConstructorParameters<V>[0][]),
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

/**
 * Generates a slug based on the given reference string.
 *
 * @param {string} reference - The reference string to generate the slug from.
 * @return {string} The generated slug.
 */
export function slugGenerator(reference: string): string {
  const randomCode = (Math.random() + 1).toString(16).substring(2);

  return reference.replaceAll(/[\W\\_]/g, '-').toLocaleLowerCase().concat(`-${randomCode}`);
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
