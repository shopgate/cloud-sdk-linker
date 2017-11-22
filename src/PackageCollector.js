/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { red } from 'chalk';
import { join } from 'path';
import { readdirSync, statSync } from 'fs';
import logger from './logger';
import PackageParser from './PackageParser';
import {
  EXTENSIONS_FOLDER,
  EXTENSIONS_FOLDER_FRONTEND,
} from './constants';

/**
 * The PackageCollector class.
 */
class PackageCollector {
  /**
   * Searches for packages within a list of passed paths.
   * @param {Array|string} [paths] The paths where packages are located.
   * @return {Array} The available packages.
   */
  get(paths = []) {
    const sanitizedPaths = (typeof paths === 'string' ? [paths] : paths);
    let packagePaths = [];

    // Collect all directories which might contain packages.
    sanitizedPaths.forEach((path) => {
      let subDirs = this.getSubDirectories(path);

      if (path.split('/').includes(EXTENSIONS_FOLDER)) {
        /**
         * Special treatment for the "extensions" folder,
         * since it's structure differs from other folders.
         */
        subDirs = this.findSubDirectories(path, EXTENSIONS_FOLDER_FRONTEND);
      }

      packagePaths = packagePaths.concat(subDirs);
    });

    const packages = [];

    // Collect package data from the directories.
    packagePaths.forEach((path) => {
      try {
        // Take care that only valid packages are added to the package list.
        packages.push({
          name: new PackageParser().parse(path).getName(),
          path,
        });
      } catch (e) {
        // Don't break the processby throwing an error, but inform the user about the issue.
        logger.log(`${red('Error')}: ${e.message}`);
      }
    });

    return packages;
  }

  /**
   * Creates a list of subdirectories for a directory.
   * @param {string} dir The directory.
   * @param {boolean} [fullPath=true] Tells if concatenated paths shall be returned.
   * @return {Array} The subdirectories.
   */
  getSubDirectories = (dir, fullPath = true) => {
    try {
      return readdirSync(dir)
        .filter(file => statSync(join(dir, file)).isDirectory())
        .map(subDir => (fullPath ? join(dir, subDir) : subDir));
    } catch (e) {
      return [];
    }
  }

  /**
   * Searches the directory tree within a directory recusively for a spedified directory name.
   * It returns a list of all found paths.
   * @param {string} dir The directory.
   * @param {string} needle The searched directory name.
   * @param {number} [depth=2] The maximum depth within the directory tree.
   * @return {Array} The search results.
   */
  findSubDirectories(dir, needle, depth = 2) {
    let result = [];

    // Get the subdirectories of the current root directory.
    this.getSubDirectories(dir, false).forEach((subDir) => {
      if (subDir === needle) {
        // Add matching directories to the results.
        result.push(join(dir, subDir));
      } else if (depth > 0) {
        // Step deeper into the directory tree if the maximum depth isn't reached yet.
        result = result.concat(this.findSubDirectories(join(dir, subDir), needle, depth - 1));
      }
    });

    return result;
  }
}

export default PackageCollector;
