/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { green, red, cyan, bold } from 'chalk';
import { execSync } from 'child_process';
import logger from './logger';
import PackageParser from './PackageParser';
import PackageCollector from './PackageCollector';
import {
  THEMES_FOLDER,
  PWA_FOLDER,
  EXTENSIONS_FOLDER,
} from './constants';

/**
 * The DependencyLinker class.
 * It enables easy package linking of checked out repositories to simplify development.
 */
class DependencyLinker {
  /**
   * Constructor of the DependencyLinker
   */
  constructor() {
    this.packages = [];
    this.linkableDependencies = [];
  }

  /**
   * Initializes the dependency linker.
   * @param {Object} options The options of the linker.
   * @return {DependencyLinker}
   */
  init(options) {
    const { theme } = options || {};

    const packageCollector = new PackageCollector();
    let packages;

    if (theme) {
      // Link only the theme that was requested.
      packages = packageCollector
        .get(THEMES_FOLDER)
        .filter(({ name }) => name.endsWith(`theme-${theme}`));
    } else {
      // Link everything that's possible if no option was set.
      packages = packageCollector
        .get([THEMES_FOLDER, EXTENSIONS_FOLDER, PWA_FOLDER]);
    }

    this.packages = packages;
    this.linkableDependencies = packageCollector.get(PWA_FOLDER);

    return this;
  }

  /**
   * Links the package dependencies.
   * @return {DependencyLinker}
   */
  link() {
    logger.logLinkingStarted();

    let tasks = [...this.packages];

    // Add the linkable dependencies to the tasks and remove tasks without dependencies.
    tasks = tasks.map((task) => {
      const packageParser = new PackageParser();
      const dependencies = packageParser
        .parse(task.path)
        .setLinkableDependencies(this.linkableDependencies)
        .getLinkableDependencies();

      return {
        ...task,
        dependencies,
      };
    }).filter(({ dependencies }) => dependencies.length > 0);

    let dependencyPaths = [];

    // Collect the paths of all linkable dependencies from the tasks.
    tasks.forEach(({ dependencies }) => {
      const paths = dependencies.map(({ path }) => path);

      dependencyPaths = dependencyPaths.concat(paths);
    });

    // Make the path entries unique.
    dependencyPaths = [...new Set(dependencyPaths)];

    if (dependencyPaths.length === 0) {
      // If there are no linkable packages, end this routine.
      logger.log(`${red('✗')} ${bold('Nothing to link')}.\n`);
      logger.log(`Make sure you execute the linker within the root of your project folder\nand that you checked out your linkable dependencies within the "${green(PWA_FOLDER)}" folder!`);
      logger.logLinkingFinished();

      return this;
    }

    logger.log(`${bold(dependencyPaths.length)} linkable dependencies within ${bold(tasks.length)} packages found. Please wait ... \n`);

    // Link all linkable packages to the global modules.
    dependencyPaths.forEach((path) => {
      this.exec('npm link', path);
      const packageParser = new PackageParser();
      const packageName = packageParser.parse(path).getName();
      logger.log(`${green('✓')} ${bold(`Linked package ${cyan(packageName)} to the global modules`)}`);
    });

    // Link the global modules to the respective packages.
    tasks.forEach(({ name: packageName, path: packagePath, dependencies }) => {
      logger.log('');
      logger.log(bold(`Linking dependencies to package ${green(packageName)}`));

      dependencies.forEach(({ name: dependencyName }) => {
        this.exec(`npm link ${dependencyName}`, packagePath, true);
        logger.log(`${green('✓')} ${bold(`Linked global module ${cyan(dependencyName)} to ${cyan(packageName)}`)}`);
      });
    });

    logger.logLinkingFinished();

    return tasks;
  }

  /**
   * Execute a command syncronous.
   * @param {string} cmd The command to execute.
   * @param {string} [cwd] The working directory.
   * @param {boolean} [silent=false] Tells of the stdout shall be suppressed.
   * @return {Buffer|string} The stdout from the command.
   */
  exec = (cmd, cwd, silent = false) => execSync(cmd, {
    ...cwd && { cwd },
    stdio: silent ? '' : 'inherit',
  });
}

export default DependencyLinker;
