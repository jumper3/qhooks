"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useContext = useContext;
exports.useContextSelector = void 0;

require("core-js/modules/es6.array.iterator.js");

require("core-js/modules/web.dom.iterable.js");

var React = _interopRequireWildcard(require("react"));

var _utils = require("./utils");

var _this = void 0;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

/**
 * This hook returns context selected value by selector.
 * It will only accept context created by `createContext`.
 * It will trigger re-render if only the selected value is referencially changed.
 */
const useContextSelector = function useContextSelector(context, selector) {
  var _this2 = this;

  _newArrowCheck(this, _this);

  const contextValue = React.useContext(context);
  const {
    value: {
      current: value
    },
    version: {
      current: version
    },
    listeners
  } = contextValue;
  const selected = selector(value);
  const [state, dispatch] = React.useReducer(function (prevState, payload) {
    _newArrowCheck(this, _this2);

    if (!payload) {
      // early bail out when is dispatched during render
      return [value, selected];
    }

    if (payload[0] <= version) {
      if (objectIs(prevState[1], selected)) {
        return prevState; // bail out
      }

      return [value, selected];
    }

    try {
      if (objectIs(prevState[0], payload[1])) {
        return prevState; // do not update
      }

      const nextSelected = selector(payload[1]);

      if (objectIs(prevState[1], nextSelected)) {
        return prevState; // do not update
      }

      return [payload[1], nextSelected];
    } catch (e) {// ignored (stale props or some other reason)
    } // explicitly spread to enforce typing


    return [prevState[0], prevState[1]]; // schedule update
  }.bind(this), [value, selected]);

  if (!objectIs(state[1], selected)) {
    // schedule re-render
    // this is safe because it's self contained
    dispatch(undefined);
  }

  (0, _utils.useIsomorphicEffect)(function () {
    var _this3 = this;

    _newArrowCheck(this, _this2);

    listeners.push(dispatch);
    return function () {
      _newArrowCheck(this, _this3);

      const index = listeners.indexOf(dispatch);
      listeners.splice(index, 1);
    }.bind(this);
  }.bind(this), [listeners]);
  return state[1];
}.bind(void 0);

exports.useContextSelector = useContextSelector;

const identity = function identity(x) {
  _newArrowCheck(this, _this);

  return x;
}.bind(void 0);

function useContext(context) {
  // 这里在新建context的时候可能传null，因此泛型类型兼容了null
  return useContextSelector(context, identity);
}
/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any


function is(x, y) {
  return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y // eslint-disable-line no-self-compare
  ;
} // eslint-disable-next-line @typescript-eslint/no-explicit-any


const objectIs = typeof Object.is === "function" ? Object.is : is;