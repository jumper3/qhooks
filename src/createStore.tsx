import React from "react";
import { composeHooks } from "./composeHooks";
import { useContextSelector, useContext } from "./useContextSelector";
import { createContext } from "./createContext";
import { Hook, HookObj, Store, ProviderProps, IUseStore, SelectorFn } from './types';

export function createStore<Value, State = void, Selected = unknown>(
    hookOrhooks: Hook<Value, State> | HookObj<Value, State>
): Store<Value, State, Selected> {
    const Context = createContext<Value | null | { [x: string]: Value; }>(null);

    const Provider = (props: ProviderProps<State>) => {
        const targetHook = typeof hookOrhooks === "object"
                ? composeHooks(hookOrhooks)
                : hookOrhooks;

        const value = targetHook(props.initialState);

        return (
            <Context.Provider value={value}>{props.children}</Context.Provider>
        );
    };

    const useStore: IUseStore<Value, Selected> = (
        selector?: SelectorFn<Value, Selected>
    ) => {
        const value = selector
            ? useContextSelector(Context, selector)
            : useContext(Context);

        if (value === null) {
            throw new Error(
                "Component must be wrapped with Provider which created by createStore()."
            );
        }
        return value;
    };

    return {
        Provider,
        useStore
    };
}
