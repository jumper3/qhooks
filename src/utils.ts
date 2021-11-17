import { useEffect, useLayoutEffect } from 'react';

export const IS_SERVER = typeof window === 'undefined' || 'Deno' in window;
// 由于在服务器端（node）执行useLayoutEffect会报错，因此用该同构方法兼容多端
export const useIsomorphicEffect = IS_SERVER ? useEffect : useLayoutEffect;
