"use strict";

require("core-js/modules/es6.array.iterator.js");

require("core-js/modules/web.dom.iterable.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createContext = void 0;

var React = _interopRequireWildcard(require("react"));

var _scheduler = require("scheduler");

var _utils = require("./utils");

var _this = void 0;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

const createProvider = function createProvider(Original) {
  var _this2 = this;

  _newArrowCheck(this, _this);

  const Provider = function Provider(props) {
    var _this3 = this;

    _newArrowCheck(this, _this2);

    // Holds an actual "props.value"
    const valueRef = React.useRef(props.value); // Used to sync context updates and avoid stale values, can be considered as render/effect counter of Provider.

    const versionRef = React.useRef(0); // A stable object, is used to avoid context updates via mutation of its values.

    const contextValue = React.useRef();

    if (!contextValue.current) {
      contextValue.current = {
        value: valueRef,
        version: versionRef,
        listeners: []
      };
    }

    (0, _utils.useIsomorphicEffect)(function () {
      var _this4 = this;

      _newArrowCheck(this, _this3);

      valueRef.current = props.value;
      versionRef.current += 1;
      (0, _scheduler.unstable_runWithPriority)(_scheduler.unstable_NormalPriority, function () {
        var _this5 = this;

        _newArrowCheck(this, _this4);

        contextValue.current.listeners.forEach(function (listener) {
          _newArrowCheck(this, _this5);

          listener([versionRef.current, props.value]);
        }.bind(this));
      }.bind(this));
    }.bind(this), [props.value]);
    return /*#__PURE__*/React.createElement(Original, {
      value: contextValue.current
    }, props.children);
  }.bind(this); // @ts-ignore


  if (process.env.NODE_ENV !== "production") {
    Provider.displayName = "ContextSelector.Provider";
  }

  return Provider;
}.bind(void 0);

const createContext = function createContext(defaultValue) {
  _newArrowCheck(this, _this);

  const context = /*#__PURE__*/React.createContext({
    value: {
      current: defaultValue
    },
    version: {
      current: -1
    },
    listeners: []
  });
  context.Provider = createProvider(context.Provider); // We don't support Consumer API

  delete context.Consumer;
  return context;
}.bind(void 0);

exports.createContext = createContext;