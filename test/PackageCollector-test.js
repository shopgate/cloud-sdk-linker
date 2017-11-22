/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import sinon from 'sinon';
import { join } from 'path';
import assert from 'assert';
import { red } from 'chalk';
import logger from '../src/logger';
import PackageCollector from '../src/PackageCollector';

const PWA_FOLDER = join(__dirname, 'mocks/pwa');
const EXTENSIONS_FOLDER = join(__dirname, 'mocks/extensions');
const NOT_EXISTING_FOLDER = join(__dirname, 'mocks/non_existing');

describe('PackageCollector', () => {
  let packageCollector;

  beforeEach(() => {
    // Create a fresh instance for every run.
    packageCollector = new PackageCollector();
  });

  it('should collect packages for a single folder', () => {
    const dir = PWA_FOLDER;
    const collection = packageCollector.get(dir);

    assert.deepEqual(collection, [
      { name: '@shopgate/eslint-config',
        path: join(dir, 'eslint-config'),
      },
      { name: '@shopgate/pwa-common',
        path: join(dir, 'pwa-common'),
      },
      { name: '@shopgate/pwa-core',
        path: join(dir, 'pwa-core'),
      },
    ]);
  });

  it('should collect packages for multiple folders', () => {
    // Stub the log method of the logger to avoid visible logs during the test.
    const loggerStub = sinon.stub(logger, 'log');
    const dirOne = PWA_FOLDER;
    const dirTwo = EXTENSIONS_FOLDER;

    const collection = packageCollector.get([dirOne, dirTwo]);

    // Restore the log method for further tests.
    loggerStub.restore();

    assert.deepEqual(collection, [
      { name: '@shopgate/eslint-config',
        path: join(dirOne, 'eslint-config'),
      },
      { name: '@shopgate/pwa-common',
        path: join(dirOne, 'pwa-common'),
      },
      { name: '@shopgate/pwa-core',
        path: join(dirOne, 'pwa-core'),
      },
      { name: '@customscope/extension-one',
        path: join(dirTwo, '@customscope/extension-one/frontend'),
      },
      { name: '@shopgate/commerce-widgets',
        path: join(dirTwo, '@shopgate/commerce-widgets/frontend'),
      },
      { name: 'custom-extension',
        path: join(dirTwo, 'custom-extension/frontend'),
      },
    ]);

    /**
     * The package "@customscope/invalid-package" contains a not well-formed package.json.
     * The PackageCollector doesn't throw an exception, but only logs a message.
     */
    sinon.assert.calledWith(loggerStub, `${red('Error')}: Invalid package at ${join(dirTwo, '@customscope/invalid-package/frontend')}`);
    sinon.assert.calledOnce(loggerStub);
  });

  it('should not collect packages when no folder is passed', () => {
    const collection = packageCollector.get();
    assert.deepEqual(collection, []);
  });

  it('should not collect packages when the passed folder is empty', () => {
    const collection = packageCollector.get(NOT_EXISTING_FOLDER);
    assert.deepEqual(collection, []);
  });
});
