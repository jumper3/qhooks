"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeHooks = void 0;

var _this = void 0;

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

/**
 * 组合多个hooks以便createStore方法生成一个总store
 * @param hooks hook数组
 * @returns hook
 */
const composeHooks = function composeHooks(hooks) {
  var _this2 = this;

  _newArrowCheck(this, _this);

  return function () {
    var _this3 = this;

    _newArrowCheck(this, _this2);

    return Object.keys(hooks).reduce(function (acc, hookKey) {
      _newArrowCheck(this, _this3);

      return { ...acc,
        [hookKey]: hooks[hookKey]()
      };
    }.bind(this), {});
  }.bind(this);
}.bind(void 0);

exports.composeHooks = composeHooks;