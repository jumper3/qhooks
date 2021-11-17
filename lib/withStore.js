"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withStore = void 0;

require("core-js/modules/es6.array.iterator.js");

require("core-js/modules/web.dom.iterable.js");

var _react = _interopRequireDefault(require("react"));

var _this = void 0;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

const isFunc = function isFunc(val) {
  _newArrowCheck(this, _this);

  return typeof val === "function";
}.bind(void 0);

const getStoreValue = function getStoreValue(storeOrUseStore) {
  _newArrowCheck(this, _this);

  let finalStore;

  if (isFunc(storeOrUseStore)) {
    // @ts-ignore
    finalStore = storeOrUseStore();
  } else {
    // @ts-ignore
    finalStore = storeOrUseStore.useStore();
  }

  return finalStore;
}.bind(void 0);

/**
 * 包装组件，使其可以支持Components
 */
const withStore = function withStore(stores, mapStoreToProps) {
  var _this2 = this;

  _newArrowCheck(this, _this);

  return function (Comp) {
    var _this3 = this;

    _newArrowCheck(this, _this2);

    return function (props) {
      _newArrowCheck(this, _this3);

      let Cprops = {};

      if (Array.isArray(stores)) {
        const storesArray = [];

        for (const store of stores) {
          storesArray.push(getStoreValue(store));
        }

        Cprops = mapStoreToProps(storesArray, props);
      } else if (stores) {
        if (isFunc(mapStoreToProps)) {
          const value = getStoreValue(stores);
          Cprops = mapStoreToProps(value, props);
        } else {
          Cprops = getStoreValue(stores);
        }
      } else {
        console.warn("Remember to give a store!");
      }

      return /*#__PURE__*/_react.default.createElement(Comp, Cprops);
    }.bind(this);
  }.bind(this);
}.bind(void 0);

exports.withStore = withStore;