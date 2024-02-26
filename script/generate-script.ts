import { readFileSync, promises, constants } from 'fs';
import { join } from 'path';
import yargs from 'yargs';

function snakeToPascal(snakeCaseString: string): string {
  // Split the string into individual words
  const words = snakeCaseString.split('_');

  // Capitalize the first letter of each word and join them together
  const pascalCaseString = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  return pascalCaseString;
}

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
  const { name, modelPath, modulePath } = await yargs(process.argv.slice(2))
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
    .help().argv;

  const modelName = snakeToPascal(name);
  // model
  await generateFile(
    {
      folderPath: modelPath,
      contentFilePath: './script/content/model.ts',
      filename: modelName,
    },
    (content) =>
      content
        .replace('ModelName', modelName)
        .replace('table_name', name.toLocaleLowerCase()),
  );

  // service
  const serviceFolderPath = join(
    modulePath,
    name.toLocaleLowerCase(),
    'services',
  );
  const serviceName = snakeToPascal(`${name}_service`);
  const serviceFilename = `${name.toLocaleLowerCase()}.service`;
  await generateFile(
    {
      folderPath: serviceFolderPath,
      contentFilePath: './script/content/service.ts',
      filename: serviceFilename,
    },
    (content) =>
      content
        .replace('ServiceName', serviceName)
        .replaceAll('ModelName', modelName)
        .replace('./model', `@models/core/${modelName}`)
        .replaceAll('modelId', `${name}Id`),
  );
  // controller
  await generateFile(
    {
      folderPath: join(modulePath, name.toLocaleLowerCase(), 'controllers'),
      contentFilePath: './script/content/controller.ts',
      filename: `${name.toLocaleLowerCase()}.controller`,
    },
    (content) =>
      content
        .replace('ControllerName', snakeToPascal(`${name}_controller`))
        .replace('path_name', name.toLocaleLowerCase())
        .replace('./service', join('../services', serviceFilename))
        .replaceAll('ServiceName', serviceName)
        .replaceAll('modelId', `${name.toLocaleLowerCase()}Id`),
  );
}

// Call the function to create the class file
generate().catch((error) => {
  console.error(`Error: ${error}`);
});
