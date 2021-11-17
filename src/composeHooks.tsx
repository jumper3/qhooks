import { HookObj } from "./types";

/**
 * 组合多个hooks以便createStore方法生成一个总store
 * @param hooks hook数组
 * @returns hook
 */
export const composeHooks = <Value, State, Hooks extends HookObj<Value, State>>(
    hooks: Hooks
) =>
    (() => Object.keys(hooks).reduce(
        (acc, hookKey) => ({ ...acc, [hookKey]: hooks[hookKey]() }),
        {}
    )as { [name in keyof Hooks]: ReturnType<Hooks[name]>});
