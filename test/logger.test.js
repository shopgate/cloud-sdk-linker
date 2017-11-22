import sinon from 'sinon';
import logger from '../src/logger';

describe('Log helper', () => {
  describe('default tests', () => {
    let logStub;

    before(() => {
      // Stub the log method to avoid real logs within the console.
      logStub = sinon.stub(logger, 'log');
    });

    after(() => {
      logStub.restore();
    });

    afterEach(() => {
      logStub.reset();
    });

    it('should log start of the linking', () => {
      logger.logLinkingStarted();
      sinon.assert.calledOnce(logStub);
    });

    it('should log end of the linking', () => {
      logger.logLinkingFinished();
      sinon.assert.calledOnce(logStub);
    });
  });

  /**
   * Tests to check, if console logs are executed correctly.
   */
  describe('console.log', () => {
    let logSpy;

    before(() => {
      logSpy = sinon.spy(logger, 'log');
    });

    after(() => {
      logSpy.restore();
    });

    afterEach(() => {
      logSpy.reset();
    });

    it('should log a message', () => {
      const message = 'nice little message';
      // Temporarily stub the log function of the console to test it's call.
      const consoleLogStub = sinon.stub(console, 'log');

      logger.log(message);

      // Restore the console.
      consoleLogStub.restore();

      sinon.assert.calledOnce(logSpy);
      sinon.assert.calledWith(logSpy, message);

      sinon.assert.calledOnce(consoleLogStub);
      sinon.assert.calledWith(consoleLogStub, message);
    });
  });
});
