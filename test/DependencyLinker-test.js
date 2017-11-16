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

describe('DependencyLinker', () => {
  let DependencyLinker;
  let dependencyLinker;

  let execSyncStub;
  let logStub;

  let execSpy;

  before(() => {
    // Replace the logger for this test, since logs are not that relevant here.
    logStub = sinon.stub(logger, 'log');
    execSyncStub = sinon.stub(childProcess, 'execSync');

    DependencyLinker = proxyquire('../src/DependencyLinker', {
      './constants': {
        THEMES_FOLDER,
        EXTENSIONS_FOLDER,
        PWA_FOLDER,
      },
    }).default;
  });

  after(() => {
    // Take care that the logger works as expected again after the suite ran.
    logStub.restore();
    execSyncStub.restore();
  });

  beforeEach(() => {
    // Create a fresh instance for every test.
    dependencyLinker = new DependencyLinker();
    execSpy = sinon.spy(dependencyLinker, 'exec');
  });

  afterEach(() => {
    // Reset the log stub to enable proper counting of the calls within the modules.
    logStub.reset();
  });

  it('should link everything without options', () => {
    dependencyLinker
      .init()
      .link();

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

  it('should only link dependencies to the theme when option is set', () => {
    const options = {
      theme: 'ios11',
    };

    dependencyLinker
      .init(options)
      .link();

    sinon.assert.callCount(execSpy, 6);
    sinon.assert.callOrder(
      execSpy.withArgs('npm link', join(PWA_FOLDER, 'pwa-common')),
      execSpy.withArgs('npm link', join(PWA_FOLDER, 'pwa-core')),
      execSpy.withArgs('npm link', join(PWA_FOLDER, 'eslint-config')),
      execSpy.withArgs('npm link @shopgate/pwa-common', join(THEMES_FOLDER, 'theme-ios11'), true),
      execSpy.withArgs('npm link @shopgate/pwa-core', join(THEMES_FOLDER, 'theme-ios11'), true),
      execSpy.withArgs('npm link @shopgate/eslint-config', join(THEMES_FOLDER, 'theme-ios11'), true)
    );

    sinon.assert.callCount(logStub, 11);
  });

  it('should link nothing if no packages are set', () => {
    dependencyLinker
      .link();

    sinon.assert.callCount(execSpy, 0);
    sinon.assert.callCount(logStub, 4);
  });
});
