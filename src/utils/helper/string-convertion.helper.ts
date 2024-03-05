// SOURCE https://www.30secondsofcode.org/js/s/string-case-conversion/

export const toCamelCase = (str) => {
  const s = str
    && str
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g,
      )
      .map((x) => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
      .join('');
  return s.slice(0, 1).toLowerCase() + s.slice(1);
};

export const toPascalCase = (str) => str
  .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
  .map((x) => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
  .join('');

export const toKebabCase = (str) => str
  && str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join('-');

export const toSnakeCase = (str) => str
&& str
  .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
  .map((x) => x.toLowerCase())
  .join('_');

export const toTitleCase = (str) => str
  .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
  .map((x) => x.slice(0, 1).toUpperCase() + x.slice(1))
  .join(' ');

export const toSentenceCase = (str) => {
  const s = str
      && str
        .match(
          /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g,
        )
        .join(' ');
  return s.slice(0, 1).toUpperCase() + s.slice(1);
};

export const convertCase = (str, toCase = 'camel') => {
  if (!str) return '';

  let s = null;
  switch (toCase) {
    case 'camel':
      s = toCamelCase(str);
      break;
    case 'pascal':
      s = toPascalCase(str);
      break;
    case 'kebab':
      s = toKebabCase(str);
      break;
    case 'snake':
      s = toSnakeCase(str);
      break;
    case 'title':
      s = toTitleCase(str);
      break;
    case 'sentence':
      s = toSentenceCase(str);
      break;
    default:
      s = str;
  }

  return s;
};
