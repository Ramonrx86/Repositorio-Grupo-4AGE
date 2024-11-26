import { RefObject } from 'react';
import { ActionSheetRef, Sheets } from './types';
/**
 * Get rendered action sheets stack
 * @returns
 */
export declare function getSheetStack(): {
    id: string;
    context: string;
}[];
/**
 * A function that checks whether the action sheet with the given id is rendered on top or not.
 * @param id
 * @param context
 * @returns
 */
export declare function isRenderedOnTop(id: string, context?: string): boolean;
/**
 * Set the base zIndex upon which action sheets will be stacked. Should be called once in the global space.
 *
 * Default `baseZIndex` is `999`.
 *
 * @param zIndex
 */
export declare function setBaseZIndexForActionSheets(zIndex: number): void;
/**
 * Since non modal based sheets are stacked one above the other, they need to have
 * different zIndex for gestures to work correctly.
 * @param id
 * @param context
 * @returns
 */
export declare function getZIndexFromStack(id: string, context: string): number;
declare class _SheetManager {
    context(options?: {
        context?: string;
        id?: string;
    }): string;
    /**
     * Show the ActionSheet with an id.
     *
     * @param id id of the ActionSheet to show
     * @param options
     */
    show<SheetId extends keyof Sheets>(id: SheetId | (string & {}), options?: {
        /**
         * Any data to pass to the ActionSheet. Will be available from the component `props` or in `onBeforeShow` prop on the action sheet.
         */
        payload?: Sheets[SheetId]['payload'];
        /**
         * Recieve payload from the Sheet when it closes
         */
        onClose?: (data: Sheets[SheetId]['returnValue'] | undefined) => void;
        /**
         * Provide `context` of the `SheetProvider` where you want to show the action sheet.
         */
        context?: string;
    }): Promise<Sheets[SheetId]['returnValue']>;
    /**
     * An async hide function. This is useful when you want to show one ActionSheet after closing another.
     *
     * @param id id of the ActionSheet to show
     * @param data
     */
    hide<SheetId extends keyof Sheets>(id: SheetId | (string & {}), options?: {
        /**
         * Return some data to the caller on closing the Sheet.
         */
        payload?: Sheets[SheetId]['returnValue'];
        /**
         * Provide `context` of the `SheetProvider` to hide the action sheet.
         */
        context?: string;
    }): Promise<Sheets[SheetId]['returnValue']>;
    /**
     * Hide all the opened ActionSheets.
     *
     * @param id Hide all sheets for the specific id.
     */
    hideAll<SheetId extends keyof Sheets>(id?: SheetId | (string & {})): void;
    registerRef: (id: string, context: string, instance: RefObject<ActionSheetRef>) => void;
    /**
     *
     * Get internal ref of a sheet by the given id.
     *
     * @param id Id of the sheet
     * @param context Context in which the sheet is rendered. Normally this function returns the top most rendered sheet ref automatically.
     */
    get: <SheetId extends never>(id: (string & {}) | SheetId, context?: string) => RefObject<ActionSheetRef<SheetId>>;
    add: (id: string, context: string) => void;
    remove: (id: string, context: string) => void;
}
/**
 * SheetManager is used to imperitively show/hide any ActionSheet with a
 * unique id prop.
 */
export declare const SheetManager: _SheetManager;
export {};
//# sourceMappingURL=sheetmanager.d.ts.map