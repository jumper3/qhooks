import React, { ReactNode, ComponentType } from "react";

export type Context<Value> = React.Context<Value | null> & {
    Provider: React.FC<React.ProviderProps<Value | null>>;
    Consumer: never;
};

export type ContextSelector<Value, SelectedValue> = (
    value: Value
) => SelectedValue;

export type ContextVersion = number;

export type ContextValue<Value> = {
    /** Holds a set of subscribers from components. */
    listeners: ((payload: readonly [ContextVersion, Value]) => void)[];

    /** Holds an actual value of React's context that will be propagated down for computations. */
    value: React.MutableRefObject<Value>;

    /** A version field is used to sync a context value and consumers. */
    version: React.MutableRefObject<ContextVersion>;
};

export type ContextValues<Value> = ContextValue<Value> & {
    /** List of listners to publish changes */
    listeners: ((
        payload: readonly [ContextVersion, Record<string, Value>]
    ) => void)[];
};

export interface ProviderProps<State = void> {
    initialState?: State;
    children: ReactNode;
}

export type SelectorFn<Value, Selected> = (value: Value) => Selected;

export interface IUseStore<Value, Selected> {
    <Value>(): Value;
    <Value, Selected>(selector: SelectorFn<Value, Selected>): Selected;
}

export interface Store<Value, State = void, Selected = unknown> {
    Provider: ComponentType<ProviderProps<State>>;
    useStore: IUseStore<Value, Selected>;
}

export type Hook<Value, State> = (initialState?: State) => Value;
export type HookObj<Value, State> = {
    [key: string]: Hook<Value, State>;
};
