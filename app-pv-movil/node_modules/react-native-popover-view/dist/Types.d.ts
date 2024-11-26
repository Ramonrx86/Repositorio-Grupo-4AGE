import { Animated, StyleProp, ViewStyle } from 'react-native';
import { ReactNode } from 'react';
export declare enum Placement {
    TOP = "top",
    RIGHT = "right",
    BOTTOM = "bottom",
    LEFT = "left",
    AUTO = "auto",
    FLOATING = "floating",
    CENTER = "center"
}
export declare enum Mode {
    JS_MODAL = "js-modal",
    RN_MODAL = "rn-modal",
    TOOLTIP = "tooltip"
}
export declare type Insets = {
    left?: number;
    right?: number;
    bottom?: number;
    top?: number;
};
export interface ModalPopoverState {
    visible: boolean;
}
export declare type PopoverProps = {
    children?: ReactNode;
    isVisible?: boolean;
    placement?: Placement | Array<Placement>;
    animationConfig?: Partial<Animated.TimingAnimationConfig>;
    offset?: number;
    verticalOffset?: number;
    displayArea?: Rect;
    displayAreaInsets?: Insets;
    popoverStyle?: StyleProp<ViewStyle>;
    popoverShift?: {
        x?: number;
        y?: number;
    };
    backgroundStyle?: StyleProp<ViewStyle>;
    arrowShift?: number;
    arrowSize?: Size;
    onOpenStart?: () => void;
    onOpenComplete?: () => void;
    onRequestClose?: () => void;
    onCloseStart?: () => void;
    onCloseComplete?: () => void;
    onPositionChange?: () => void;
    debug?: boolean;
};
export declare class Point {
    x: number;
    y: number;
    constructor(x: number, y: number);
    equals(b: Point): boolean;
}
export declare class Size {
    width: number;
    height: number;
    constructor(width: number, height: number);
    equals(b: Size): boolean;
}
export declare class Rect {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x: number, y: number, width: number, height: number);
    equals(b: Rect): boolean;
    static clone(rect: Rect): Rect;
}
