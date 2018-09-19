const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');
const { pascalize } = require('humps');
const deleteMigrations = require('./subCommands/deleteMigrations');
const { computeModulesPath, deleteFromFileWithExports } = require('../helpers/util');

/**
 * Removes the module from client, server or both locations and removes the module from the Feature connector.
 *
 * @param logger - The Logger.
 * @param moduleName - The name of a new module.
 * @param location - The location for a new module [client|server|both].
 */
function deleteModule(logger, moduleName, options, location) {
  logger.info(`Deleting ${location} files…`);

  // pascalize
  const Module = pascalize(moduleName);
  const modulePath = computeModulesPath(location, moduleName);
  const modulesPath = computeModulesPath(location);
  const moduleCommonPath = `${modulesPath}/common`;
  const generatedContainerFile = 'generatedContainers.js';
  const generatedContainerPath = `${moduleCommonPath}/${generatedContainerFile}`;
  const generatedSchemasFile = 'generatedSchemas.js';
  const generatedSchemaPath = `${moduleCommonPath}/${generatedSchemasFile}`;

  if (fs.existsSync(modulePath)) {
    // remove module directory
    shell.rm('-rf', modulePath);

    const modulesPath = computeModulesPath(location);

    // get index file path
    const indexFullFileName = fs.readdirSync(modulesPath).find(name => name.search(/index/) >= 0);
    const indexPath = modulesPath + indexFullFileName;
    let indexContent;

    try {
      indexContent = fs.readFileSync(indexPath);
    } catch (e) {
      logger.error(chalk.red(`Failed to read ${indexPath} file`));
      process.exit();
    }

    // extract Feature modules
    const featureRegExp = /Feature\(([^()]+)\)/g;
    const [, featureModules] = featureRegExp.exec(indexContent) || ['', ''];
    const featureModulesWithoutDeleted = featureModules
      .split(',')
      .filter(featureModule => featureModule.trim() !== moduleName);

    const contentWithoutDeletedModule = indexContent
      .toString()
      // replace features modules on features without deleted module
      .replace(featureRegExp, `Feature(${featureModulesWithoutDeleted.toString().trim()})`)
      // remove import module
      .replace(RegExp(`import ${moduleName} from './${moduleName}';\n`, 'g'), '');

    fs.writeFileSync(indexPath, contentWithoutDeletedModule);

    // delete migrations and seeds if server location and option -m specified
    if (location === 'server' && options.m) {
      deleteMigrations(logger, moduleName);
    }
    logger.info(chalk.green(`✔ Module for ${location} successfully deleted!`));
  } else {
    logger.info(chalk.red(`✘ Module ${location} location for ${modulePath} not found!`));
  }

  if (fs.existsSync(generatedContainerPath)) {
    const graphqlQuery = `${Module}Query`;
    deleteFromFileWithExports(generatedContainerPath, graphqlQuery);
  }
  if (fs.existsSync(generatedSchemaPath)) {
    const schema = `${Module}Schema`;
    deleteFromFileWithExports(generatedSchemaPath, schema);
  }
}

module.exports = deleteModule;