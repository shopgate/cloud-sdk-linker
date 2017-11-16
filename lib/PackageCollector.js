'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chalk = require('chalk');

var _path = require('path');

var _fs = require('fs');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _PackageParser = require('./PackageParser');

var _PackageParser2 = _interopRequireDefault(_PackageParser);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PackageCollector = function () {
  function PackageCollector() {
    _classCallCheck(this, PackageCollector);

    this.getSubDirectories = function (dir) {
      var fullPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      try {
        return (0, _fs.readdirSync)(dir).filter(function (file) {
          return (0, _fs.statSync)((0, _path.join)(dir, file)).isDirectory();
        }).map(function (subDir) {
          return fullPath ? (0, _path.join)(dir, subDir) : subDir;
        });
      } catch (e) {
        return [];
      }
    };
  }

  _createClass(PackageCollector, [{
    key: 'get',
    value: function get() {
      var _this = this;

      var paths = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var sanitizedPaths = typeof paths === 'string' ? [paths] : paths;

      var packagePaths = [];

      sanitizedPaths.forEach(function (path) {
        var subDirs = void 0;
        if (path.split('/').includes(_constants.EXTENSIONS_FOLDER)) {
          subDirs = _this.findSubDirectories(path, _constants.EXTENSIONS_FOLDER_FRONTEND);
        } else {
          subDirs = _this.getSubDirectories(path);
        }

        packagePaths = packagePaths.concat(subDirs);
      });

      var packages = [];

      packagePaths.forEach(function (path) {
        try {
          packages.push({
            name: new _PackageParser2.default().parse(path).getName(),
            path: path
          });
        } catch (e) {
          _logger2.default.log((0, _chalk.red)('Error') + ': ' + e.message);
        }
      });

      return packages;
    }
  }, {
    key: 'findSubDirectories',
    value: function findSubDirectories(dir, needle) {
      var _this2 = this;

      var depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;

      var result = [];

      this.getSubDirectories(dir, false).forEach(function (subDir) {
        if (subDir === needle) {
          result.push((0, _path.join)(dir, subDir));
        } else if (depth > 0) {
          result = result.concat(_this2.findSubDirectories((0, _path.join)(dir, subDir), needle, depth - 1));
        }
      });

      return result;
    }
  }]);

  return PackageCollector;
}();

exports.default = PackageCollector;