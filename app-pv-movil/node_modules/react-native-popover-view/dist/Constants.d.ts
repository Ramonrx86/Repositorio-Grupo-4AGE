import { Size } from './Types';
export declare const MULTIPLE_POPOVER_WARNING = "Popover Warning - Can't Show - Attempted to show a Popover while another one was already showing.  You can only show one Popover at a time, and must wait for one to close completely before showing a different one.  You can use the onCloseComplete prop to detect when a Popover has finished closing.  To show multiple Popovers simultaneously, all but one should have mode={Popover.MODE.JS_MODAL}.  Once you change the mode, you can show as many Popovers as you want, but you are responsible for keeping them above other views.";
export declare const DEFAULT_ARROW_SIZE: Size;
export declare const DEFAULT_BORDER_RADIUS = 3;
export declare const POPOVER_MARGIN = 10;
export declare const DEBUG = false;
export declare const isIOS: boolean;
export declare const isWeb: boolean;
export declare const FIX_SHIFT: number;
export declare const styles: {
    container: {
        top: number;
        bottom: number;
        left: number;
        right: number;
        position: "absolute";
        backgroundColor: string;
    };
    background: {
        top: number;
        bottom: number;
        left: number;
        right: number;
        position: "absolute";
        backgroundColor: string;
    };
    popoverContent: {
        overflow: "hidden";
        position: "absolute";
        backgroundColor: string;
        borderBottomColor: string;
        borderRadius: number;
    };
};
