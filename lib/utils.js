"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useIsomorphicEffect = exports.IS_SERVER = void 0;

var _react = require("react");

// @ts-ignore
const IS_SERVER = typeof window === 'undefined' || 'Deno' in window; // 由于在服务器端（node）执行useLayoutEffect会报错，因此用该同构方法兼容多端

exports.IS_SERVER = IS_SERVER;
const useIsomorphicEffect = IS_SERVER ? _react.useEffect : _react.useLayoutEffect;
exports.useIsomorphicEffect = useIsomorphicEffect;