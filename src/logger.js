/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { green, blue } from 'chalk';

const logger = console;

/**
 * The Logger class hold static functions for logging useful information when running
 * the Rapid Dev Server and the Webpack Dev Server.
 * @type {LogHelper}
 */
class LogHelper {
  /**
   * LogHelper.
   */
  constructor() {
    /**
     * A colored Shopgate Cloud prefix for console outputs.
     * @type {string}
     */
    this.prefix = `${green('Shopgate')}${blue('Cloud')}`;
  }

  /**
   * Logs a message
   * @param {string} message The message
   * @return {LogHelper}
   */
  log(message) {
    logger.log(message);
    return this;
  }

  /**
   * Logs if the linking process started.
   * @return {LogHelper}
   */
  logLinkingStarted() {
    this.log(`\n${this.prefix} Linking modules ...\n`);
    return this;
  }

  /**
   * Logs if the linking process finished.
   * @return {LogHelper}
   */
  logLinkingFinished() {
    this.log(`\n${this.prefix} Linking finished.\n`);
    return this;
  }
}

export default new LogHelper();
