"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStore = createStore;

var _react = _interopRequireDefault(require("react"));

var _composeHooks = require("./composeHooks");

var _useContextSelector = require("./useContextSelector");

var _createContext = require("./createContext");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

function createStore(hookOrhooks) {
  var _this = this;

  const Context = (0, _createContext.createContext)(null);

  const Provider = function Provider(props) {
    _newArrowCheck(this, _this);

    const targetHook = typeof hookOrhooks === "object" ? (0, _composeHooks.composeHooks)(hookOrhooks) : hookOrhooks;
    const value = targetHook(props.initialState);
    return /*#__PURE__*/_react.default.createElement(Context.Provider, {
      value: value
    }, props.children);
  }.bind(this);

  const useStore = function useStore(selector) {
    _newArrowCheck(this, _this);

    const value = selector ? (0, _useContextSelector.useContextSelector)(Context, selector) : (0, _useContextSelector.useContext)(Context);

    if (value === null) {
      throw new Error("Component must be wrapped with Provider which created by createStore().");
    }

    return value;
  }.bind(this);

  return {
    Provider,
    useStore
  };
}