/// <reference types="react" />
import { Animated } from 'react-native';
import { Sheets, ActionSheetRef } from '../types';
export type RouteDefinition<T extends {} = {}> = T;
export type Route<Key extends keyof Sheets = never, K extends keyof Sheets[Key]['routes'] = never> = {
    /**
     * Name of the route.
     */
    name: K | (string & {});
    /**
     * A react component that will render when this route is navigated to.
     */
    component: any;
    /**
     * Initial params for the route.
     */
    params?: Sheets[Key]['routes'][K];
};
export type Router<Key extends keyof Sheets = never> = {
    currentRoute: Route<Key>;
    /**
     * Navigate to a route
     *
     * @param name  Name of the route to navigate to
     * @param params Params to pass to the route upon navigation. These can be accessed in the route using `useSheetRouteParams` hook.
     * @param snap Snap value for navigation animation. Between -100 to 100. A positive value snaps inwards, while a negative value snaps outwards.
     */
    navigate: <RouteKey extends keyof Sheets[Key]['routes']>(name: RouteKey | (string & {}), params?: Sheets[Key]['routes'][RouteKey] | any, snap?: number) => void;
    /**
     * Navigate back from a route.
     *
     * @param name  Name of the route to navigate back to.
     * @param snap Snap value for navigation animation. Between -100 to 100. A positive value snaps inwards, while a negative value snaps outwards.
     */
    goBack: <RouteKey extends keyof Sheets[Key]['routes']>(name?: RouteKey | (string & {}), snap?: number) => void;
    /**
     * Close the action sheet.
     */
    close: () => void;
    /**
     * Pop to top of the stack.
     */
    popToTop: () => void;
    /**
     * Whether this router has any routes registered.
     */
    hasRoutes: () => boolean | undefined;
    /**
     * Get the currently rendered stack.
     */
    stack: Route<Key>[];
    /**
     * An internal function called by sheet to navigate to initial route.
     */
    initialNavigation: () => void;
    canGoBack: () => boolean;
};
export declare const useRouter: ({ onNavigate, onNavigateBack, initialRoute, routes, getRef, routeOpacity, }: {
    initialRoute?: string;
    routes?: Route[];
    getRef?: () => ActionSheetRef;
    onNavigate?: (route: string) => void;
    onNavigateBack?: (route: string) => void;
    routeOpacity: Animated.Value;
}) => Router;
export declare const RouterContext: import("react").Context<Router<never>>;
/**
 * A hook that you can use to control the router.
 */
export declare function useSheetRouter<SheetId extends keyof Sheets>(id?: SheetId | (string & {})): Router<SheetId> | undefined;
export declare const RouterParamsContext: import("react").Context<any>;
/**
 * A hook that returns the params for current navigation route.
 */
export declare function useSheetRouteParams<SheetId extends keyof Sheets = never, RouteKey extends keyof Sheets[SheetId]['routes'] = never>(id?: SheetId | (string & {}), routeKey?: RouteKey | (string & {})): Sheets[SheetId]['routes'][RouteKey];
export type RouteScreenProps<SheetId extends keyof Sheets = never, RouteKey extends keyof Sheets[SheetId]['routes'] = never> = {
    router: Router<SheetId>;
    params: Sheets[SheetId]['routes'][RouteKey];
    /**
     * @deprecated use `useSheetPayload` hook.
     */
    payload: Sheets[SheetId]['beforeShowPayload'];
};
//# sourceMappingURL=use-router.d.ts.map