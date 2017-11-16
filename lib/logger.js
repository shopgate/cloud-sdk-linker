'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chalk = require('chalk');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LogHelper = function () {
  function LogHelper() {
    _classCallCheck(this, LogHelper);

    this.prefix = '' + (0, _chalk.green)('Shopgate') + (0, _chalk.blue)('Cloud');
  }

  _createClass(LogHelper, [{
    key: 'log',
    value: function log(message) {
      console.log(message);

      return this;
    }
  }, {
    key: 'logLinkingStarted',
    value: function logLinkingStarted() {
      this.log('\n' + this.prefix + ' Linking modules ...\n');
      return this;
    }
  }, {
    key: 'logLinkingFinished',
    value: function logLinkingFinished() {
      this.log('\n' + this.prefix + ' Linking finished.\n');
      return this;
    }
  }]);

  return LogHelper;
}();

exports.default = new LogHelper();