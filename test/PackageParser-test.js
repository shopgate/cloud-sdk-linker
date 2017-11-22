/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { join } from 'path';
import assert from 'assert';
import PackageCollector from '../src/PackageCollector';
import PackageParser from '../src/PackageParser';

const THEMES_FOLDER = join(__dirname, 'mocks/themes');
const PWA_FOLDER = join(__dirname, 'mocks/pwa');
const INVALID_PACKAGE_FOLDER = join(__dirname, 'mocks/extensions/@customscope/invalid-package/frontend');

describe('PackageParser', () => {
  let packageParser;

  beforeEach(() => {
    packageParser = new PackageParser();
  });

  describe('default tests', () => {
    beforeEach(() => {
      packageParser.parse(join(THEMES_FOLDER, 'theme-gmd'));
    });

    it('should contain the expected name', () => {
      assert.equal(packageParser.getName(), '@shopgate/theme-gmd');
    });

    it('should return linkable dependencies, if some where set', () => {
      const packageCollector = new PackageCollector();
      const dependencies = packageCollector.get(PWA_FOLDER);

      packageParser.setLinkableDependencies(dependencies);

      assert.deepEqual(packageParser.getLinkableDependencies(), [
        {
          name: '@shopgate/pwa-common',
          path: join(PWA_FOLDER, 'pwa-common'),
        },
        { name: '@shopgate/pwa-core',
          path: join(PWA_FOLDER, 'pwa-core'),
        },
        {
          name: '@shopgate/eslint-config',
          path: join(PWA_FOLDER, 'eslint-config') },
      ]);
    });

    it('should not return linkable dependencies, if none where set', () => {
      assert.deepEqual(packageParser.getLinkableDependencies(), []);
    });
  });

  describe('errors', () => {
    it('should throw an error when trying to parse an invalid package.json', () => {
      const dir = INVALID_PACKAGE_FOLDER

      try {
        packageParser.parse(dir);
      } catch (err) {
        assert.equal(err.message, `Invalid package at ${dir}`);
      }
    });

    it('should throw an error when getting package name without initialization', () => {
      try {
        packageParser.getName();
      } catch (err) {
        assert.equal(err.message, 'PackageParser not initialized');
      }
    });

    it('should throw an error when getting dependencies without initialization', () => {
      try {
        packageParser.getLinkableDependencies();
      } catch (err) {
        assert.equal(err.message, 'PackageParser not initialized');
      }
    });
  });
});
