import { toKebabCase, toPascalCase, toSnakeCase } from '@utils/helper/string-convertion.helper';
import { readFileSync, promises, constants } from 'fs';
import { join } from 'path';
import yargs from 'yargs';

// function snakeToPascal(snakeCaseString: string): string {
//   // Split the string into individual words
//   const words = snakeCaseString.split('_');

//   // Capitalize the first letter of each word and join them together
//   const pascalCaseString = words
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join('');

//   return pascalCaseString;
// }

async function generateFile(
  { folderPath, contentFilePath, filename },
  modifyContent: (modifiedContent: string) => string,
) {
  // Configure command-line options using yargs
  const content = readFileSync(contentFilePath, 'utf8');

  const modifiedContent = modifyContent(content);
  try {
    // Check if the folder exists, create if not
    await promises.access(folderPath, constants.F_OK);
  } catch (error) {
    await promises.mkdir(folderPath, { recursive: true });
  }

  const filePath = join(folderPath, `${filename}.ts`);

  try {
    // Check if the file already exists
    await promises.access(filePath, constants.F_OK);
    console.log(`File ${filename} already exists.`);
  } catch (error) {
    // Write content to the new file
    await promises.writeFile(filePath, modifiedContent);
    console.log(`File ${filename}.`);
  }
}
async function generate() {
  // Configure command-line options using yargs
  const {
    name, modelPath, modulePath, modulePrefix,
  } = await yargs(
    process.argv.slice(2),
  )
    .option('name', {
      alias: 'n',
      describe: 'Name of the class',
      demandOption: true, // Require this option
      default: 'Model',
      type: 'string', // Specify type
    })
    .option('modelPath', {
      describe: 'Path to the folder model',
      default: './src/models/core',
      type: 'string',
    })
    .option('modulePath', {
      describe: 'Path to the module folder',
      demandOption: true,
      default: './src',
      type: 'string',
    })
    .option('modulePrefix', {
      describe: 'Prefix of module',
      type: 'string',
    })
    .help().argv;

  const modelName = toPascalCase(name);
  const prefix = modulePrefix?.toLocaleLowerCase() || '';
  const newName = toKebabCase(name);
  // model
  await generateFile(
    {
      folderPath: modelPath,
      contentFilePath: './script/content/model.ts',
      filename: modelName,
    },
    (content) => content
      .replace('ModelName', modelName)
      .replace('table_name', toSnakeCase(name)),
  );

  // service
  const serviceFolderPath = join(
    modulePath,
    newName,
    'services',
  );
  const serviceName = toPascalCase(
    `${prefix ? `${prefix}_` : ''}${name}_service`,
  );
  const serviceFilename = `${
    prefix ? `${prefix}.` : ''
  }${newName}.service`;
  await generateFile(
    {
      folderPath: serviceFolderPath,
      contentFilePath: './script/content/service.ts',
      filename: serviceFilename,
    },
    (content) => content
      .replace('ServiceName', serviceName)
      .replaceAll('ModelName', modelName)
      .replace('./model', `@models/core/${modelName}`)
      .replaceAll('modelId', `${name.toLocaleLowerCase()}Id`),
  );

  // request
  const requestName = toPascalCase(`${prefix ? `${prefix}_` : ''}${name}`);
  const requestFilename = `${prefix ? `${prefix}.` : ''}${newName}.request`;
  await generateFile(
    {
      folderPath: join(modulePath, newName, 'controllers', 'requests'),
      contentFilePath: './script/content/request.ts',
      filename: requestFilename,
    },
    (content) => content.replaceAll('RequestName', requestName),
  );

  // filter
  const filterName = toPascalCase(`${prefix ? `${prefix}_` : ''}${name}_list_filter`);
  const filterFilename = `${prefix ? `${prefix}.` : ''}${newName}.filter`;
  await generateFile(
    {
      folderPath: join(modulePath, newName, 'controllers', 'filters'),
      contentFilePath: './script/content/filter.ts',
      filename: filterFilename,
    },
    (content) => content
      .replace('FilterName', filterName)
      .replaceAll('RequestName', requestName)
      .replace(
        './request',
        join('../request', requestFilename).replaceAll('\\', '/'),
      ),
  );

  // viewmodel
  const viewmodelFolderPath = join(
    modulePath,
    newName,
    'controllers',
    'viewmodels',
  );
  const viewmodelName = toPascalCase(
    `${prefix ? `${prefix}_` : ''}${name}_vm`,
  );
  const viewmodelFilename = `${
    prefix ? `${prefix}.` : ''
  }${newName}.viewmodel`;
  await generateFile(
    {
      folderPath: viewmodelFolderPath,
      contentFilePath: './script/content/viewmodel.ts',
      filename: viewmodelFilename,
    },
    (content) => content
      .replace('ViewmodelName', viewmodelName),
  );

  // controller
  const controllerName = toPascalCase(`${prefix ? `${prefix}_` : ''}${name}_controller`);
  const controllerFilename = `${prefix ? `${prefix}.` : ''}${newName}.controller`;
  await generateFile(
    {
      folderPath: join(modulePath, newName, 'controllers'),
      contentFilePath: './script/content/controller.ts',
      filename: controllerFilename,
    },
    (content) => content
      .replace('ControllerName', controllerName)
      .replace('path_name', name.toLocaleLowerCase())
      .replace('./service', join('../services', serviceFilename).replaceAll('\\', '/'))
      .replaceAll('ServiceName', serviceName)
      .replaceAll('modelId', `${name.toLocaleLowerCase()}Id`)
      .replaceAll('FilterName', filterName)
      .replace('./filter', `./${join('filters', filterFilename).replaceAll('\\', '/')}`)
      .replaceAll('RequestName', requestName)
      .replace('./request', `./${join('requests', requestFilename).replaceAll('\\', '/')}`)
      .replace('./viewmodel', `./${join('viewmodels', requestFilename).replaceAll('\\', '/')}`)
      .replaceAll('ViewmodelName', viewmodelName),
  );

  // module
  const moduleName = toPascalCase(`${prefix ? `${prefix}_` : ''}${name}_module`);
  const moduleFilename = `${prefix ? `${prefix}.` : ''}${newName}.module`;
  await generateFile(
    {
      folderPath: join(modulePath, newName),
      contentFilePath: './script/content/module.ts',
      filename: moduleFilename,
    },
    (content) => content
      .replace('ModuleName', moduleName)
      .replace('./service', `./${join('./services', serviceFilename).replaceAll('\\', '/')}`)
      .replaceAll('ServiceName', serviceName)
      .replace('./controller', `./${join('./controllers', controllerFilename).replaceAll('\\', '/')}`)
      .replaceAll('ControllerName', controllerName),
  );
}

// Call the function to create the class file
generate().catch((error) => {
  console.error(`Error: ${error}`);
});
