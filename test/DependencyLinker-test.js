/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { join } from 'path';
import sinon from 'sinon';
import childProcess from 'child_process';
import proxyquire from 'proxyquire';
import logger from '../src/logger';

const THEMES_FOLDER = join(__dirname, 'mocks/themes');
const EXTENSIONS_FOLDER = join(__dirname, 'mocks/extensions');
const PWA_FOLDER = join(__dirname, 'mocks/pwa');

const EMPTY_FOLDER = join(__dirname, 'mocks/empty');

let execSpy;

/**
 * Creates a new DependencyLinker instance and adds a spy to the exec method.
 * @param {Object} [constants={}] Values for the constant mocks.
 * @return {Object}
 */
const createInstance = (constants = {}) => {
  const DependencyLinker = proxyquire('../src/DependencyLinker', {
    './constants': constants,
  }).default;

  const dependencyLinker = new DependencyLinker();

  execSpy = sinon.spy(dependencyLinker, 'exec');

  return dependencyLinker;
}

describe('DependencyLinker', () => {
  let DependencyLinker;
  let dependencyLinker;

  let execSyncStub;
  let logStub;

  before(() => {
    // Replace the logger for this test, since logs are not that relevant here.
    logStub = sinon.stub(logger, 'log');
    execSyncStub = sinon.stub(childProcess, 'execSync');
  });

  after(() => {
    // Take care that the logger works as expected again after the suite ran.
    logStub.restore();
    execSyncStub.restore();
  });

  afterEach(() => {
    // Reset the log stub to enable proper counting of the calls within the modules.
    logStub.reset();
  });

  it('should link everything', () => {
    const dependencyLinker = createInstance({
      THEMES_FOLDER,
      EXTENSIONS_FOLDER,
      PWA_FOLDER,
    });

    dependencyLinker.link();

    sinon.assert.callCount(execSpy, 17);
    sinon.assert.callOrder(
      execSpy.withArgs('npm link', join(PWA_FOLDER, 'pwa-common')),
      execSpy.withArgs('npm link', join(PWA_FOLDER, 'pwa-core')),
      execSpy.withArgs('npm link', join(PWA_FOLDER, 'eslint-config')),
      execSpy.withArgs('npm link @shopgate/pwa-common', join(THEMES_FOLDER, 'theme-gmd'), true),
      execSpy.withArgs('npm link @shopgate/pwa-core', join(THEMES_FOLDER, 'theme-gmd'), true),
      execSpy.withArgs('npm link @shopgate/eslint-config', join(THEMES_FOLDER, 'theme-gmd'), true),
      execSpy.withArgs('npm link @shopgate/pwa-common', join(THEMES_FOLDER, 'theme-ios11'), true),
      execSpy.withArgs('npm link @shopgate/pwa-core', join(THEMES_FOLDER, 'theme-ios11'), true),
      execSpy.withArgs('npm link @shopgate/eslint-config', join(THEMES_FOLDER, 'theme-ios11'), true),
      execSpy.withArgs('npm link @shopgate/pwa-common', join(EXTENSIONS_FOLDER, '@customscope/extension-one/frontend'), true),
      execSpy.withArgs('npm link @shopgate/eslint-config', join(EXTENSIONS_FOLDER, '@shopgate/commerce-widgets/frontend'), true),
      execSpy.withArgs('npm link @shopgate/pwa-common', join(EXTENSIONS_FOLDER, '@shopgate/commerce-widgets/frontend'), true),
      execSpy.withArgs('npm link @shopgate/pwa-core', join(EXTENSIONS_FOLDER, '@shopgate/commerce-widgets/frontend'), true),
      execSpy.withArgs('npm link @shopgate/pwa-common', join(EXTENSIONS_FOLDER, 'custom-extension/frontend'), true),
      execSpy.withArgs('npm link @shopgate/eslint-config', join(PWA_FOLDER, 'pwa-common'), true),
      execSpy.withArgs('npm link @shopgate/pwa-core', join(PWA_FOLDER, 'pwa-common'), true),
      execSpy.withArgs('npm link @shopgate/eslint-config', join(PWA_FOLDER, 'pwa-core'), true)
    );

    sinon.assert.callCount(logStub, 35);
  });

  it('should link nothing if no packages are set', () => {
    // Use an empty folder for dependency sources
    const dependencyLinker = createInstance({
      THEMES_FOLDER,
      EXTENSIONS_FOLDER: EMPTY_FOLDER,
      PWA_FOLDER: EMPTY_FOLDER,
    });

    dependencyLinker
      .link();

    sinon.assert.callCount(execSpy, 0);
    sinon.assert.callCount(logStub, 5);
  });
});
