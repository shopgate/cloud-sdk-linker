'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fsExtra = require('fs-extra');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PackageParser = function () {
  function PackageParser() {
    _classCallCheck(this, PackageParser);

    this.content = null;
    this.linkableDependencies = [];
  }

  _createClass(PackageParser, [{
    key: 'parse',
    value: function parse(path) {
      try {
        this.content = (0, _fsExtra.readJsonSync)(path + '/package.json');
      } catch (e) {
        this.content = null;
        throw new Error('Invalid package at ' + path);
      }

      return this;
    }
  }, {
    key: 'getName',
    value: function getName() {
      if (this.content === null) {
        throw new Error('PackageParser not initialized');
      }

      return this.content.name;
    }
  }, {
    key: 'setLinkableDependencies',
    value: function setLinkableDependencies(packages) {
      this.linkableDependencies = packages;
      return this;
    }
  }, {
    key: 'getLinkableDependencies',
    value: function getLinkableDependencies() {
      var _this = this;

      var filterDependencies = function filterDependencies() {
        var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return Object.keys(source).map(function (name) {
          var dependency = _this.linkableDependencies.find(function (linkableDependency) {
            return name === linkableDependency.name;
          });

          return dependency || false;
        }).filter(function (entry) {
          return entry !== false;
        });
      };

      if (this.content === null) {
        throw new Error('PackageParser not initialized');
      }

      var _content = this.content,
          dependencies = _content.dependencies,
          devDependencies = _content.devDependencies;

      return filterDependencies(dependencies).concat(filterDependencies(devDependencies));
    }
  }]);

  return PackageParser;
}();

exports.default = PackageParser;