'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chalk = require('chalk');

var _child_process = require('child_process');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _PackageParser = require('./PackageParser');

var _PackageParser2 = _interopRequireDefault(_PackageParser);

var _PackageCollector = require('./PackageCollector');

var _PackageCollector2 = _interopRequireDefault(_PackageCollector);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DependencyLinker = function () {
  function DependencyLinker() {
    _classCallCheck(this, DependencyLinker);

    this.exec = function (cmd) {
      var cwd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var silent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      return (0, _child_process.execSync)(cmd, _extends({}, cwd && { cwd: cwd }, {
        stdio: silent ? '' : 'inherit'
      }));
    };

    var packageCollector = new _PackageCollector2.default();

    this.packages = packageCollector.get([_constants.THEMES_FOLDER, _constants.EXTENSIONS_FOLDER, _constants.PWA_FOLDER]);
    this.linkableDependencies = packageCollector.get(_constants.PWA_FOLDER);
  }

  _createClass(DependencyLinker, [{
    key: 'link',
    value: function link() {
      var _this = this,
          _ref2;

      _logger2.default.logLinkingStarted();

      var tasks = this.packages.map(function (task) {
        var packageParser = new _PackageParser2.default();
        var dependencies = packageParser.parse(task.path).setLinkableDependencies(_this.linkableDependencies).getLinkableDependencies();

        return _extends({}, task, {
          dependencies: dependencies
        });
      }).filter(function (_ref) {
        var dependencies = _ref.dependencies;
        return dependencies.length > 0;
      });

      var dependencyPaths = (_ref2 = []).concat.apply(_ref2, _toConsumableArray(tasks.map(function (_ref3) {
        var dependencies = _ref3.dependencies;
        return dependencies.map(function (_ref4) {
          var path = _ref4.path;
          return path;
        });
      })));

      dependencyPaths = [].concat(_toConsumableArray(new Set(dependencyPaths)));

      if (dependencyPaths.length === 0) {
        _logger2.default.log((0, _chalk.red)('✗') + ' ' + (0, _chalk.bold)('Nothing to link') + '.\n');

        _logger2.default.log('Make sure you execute the linker within the root of your project folder');
        _logger2.default.log('and that you checked out your linkable dependencies within the "' + (0, _chalk.green)(_constants.PWA_FOLDER) + '" folder!');
        _logger2.default.logLinkingFinished();

        return this;
      }

      _logger2.default.log((0, _chalk.bold)(dependencyPaths.length) + ' linkable dependencies within ' + (0, _chalk.bold)(tasks.length) + ' packages found. Please wait ...\n');

      dependencyPaths.forEach(function (path) {
        _this.exec('npm link', path);
        var packageParser = new _PackageParser2.default();
        var packageName = packageParser.parse(path).getName();
        _logger2.default.log((0, _chalk.green)('✓') + ' ' + (0, _chalk.bold)('Linked package ' + (0, _chalk.cyan)(packageName) + ' to the global modules'));
      });

      tasks.forEach(function (_ref5) {
        var packageName = _ref5.name,
            packagePath = _ref5.path,
            dependencies = _ref5.dependencies;

        _logger2.default.log('');
        _logger2.default.log((0, _chalk.bold)('Linking dependencies to package ' + (0, _chalk.green)(packageName)));

        dependencies.forEach(function (_ref6) {
          var dependencyName = _ref6.name;

          _this.exec('npm link ' + dependencyName, packagePath, true);
          _logger2.default.log((0, _chalk.green)('✓') + ' ' + (0, _chalk.bold)('Linked global module ' + (0, _chalk.cyan)(dependencyName) + ' to ' + (0, _chalk.cyan)(packageName)));
        });
      });

      _logger2.default.logLinkingFinished();

      return tasks;
    }
  }]);

  return DependencyLinker;
}();

exports.default = DependencyLinker;