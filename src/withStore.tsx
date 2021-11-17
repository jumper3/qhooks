import React, { ComponentType, NamedExoticComponent } from "react";
import { Store } from './types';

export type UseStore<Value> = () => Value;
type StoreOrUseModal<Value> = UseStore<Value> | Store<Value>;
type Stores<Value> = StoreOrUseModal<Value> | StoreOrUseModal<Value>[];

type MapStoreToProps<TStoreProps, TOwnProps, Stores> = (
    store: Stores,
    ownProps: TOwnProps
    ) => TStoreProps;
    
const isFunc = (val: unknown): boolean => typeof val === "function";

type GetStoreValue<Value> = (storeOrUseStore: StoreOrUseModal<Value>) => Value

const getStoreValue: GetStoreValue<any> = (storeOrUseStore) => {
    let finalStore;
    if (isFunc(storeOrUseStore)) {
        // @ts-ignore
        finalStore = storeOrUseStore();
    } else {
        // @ts-ignore
        finalStore = storeOrUseStore.useStore();
    }
    return finalStore;
};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetProps<C> = C extends ComponentType<infer P> ? P : never;

export type ConnectedComponent<
    C extends ComponentType<any>,
    P
    > = NamedExoticComponent<JSX.LibraryManagedAttributes<C, P>> & {
        WrappedComponent: C;
    };

export type Matching<InjectedProps, DecorationTargetProps> = {
    [P in keyof DecorationTargetProps]: P extends keyof InjectedProps
    ? InjectedProps[P] extends DecorationTargetProps[P]
    ? DecorationTargetProps[P]
    : InjectedProps[P]
    : DecorationTargetProps[P];
};

export type Shared<InjectedProps, DecorationTargetProps> = {
    [P in Extract<
        keyof InjectedProps,
        keyof DecorationTargetProps
    >]?: InjectedProps[P] extends DecorationTargetProps[P]
    ? DecorationTargetProps[P]
    : never;
};
    
export type InferableComponentEnhancerWithProps<TInjectedProps, TNeedsProps> = <
    C extends ComponentType<Matching<TInjectedProps, GetProps<C>>>
    >(
    component: C
) => ConnectedComponent<
    C,
    Omit<GetProps<C>, keyof Shared<TInjectedProps, GetProps<C>>> & TNeedsProps
>;

/**
 * 包装组件，使其可以支持Components
 */
export const withStore = <TStoreProps, TOwnProps, Value>(
        stores: Stores<Value>,
        mapStoreToProps: MapStoreToProps<TStoreProps, TOwnProps, Stores<Value>>
    ) =>
    (Comp: ComponentType) =>
    (props: TOwnProps) => {
        let Cprops = {};
        if (Array.isArray(stores)) {
            const storesArray = [];
            for (const store of stores) {
                // @ts-ignore
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
        return <Comp {...Cprops} /> as unknown as InferableComponentEnhancerWithProps<TStoreProps, TOwnProps>;
    };
