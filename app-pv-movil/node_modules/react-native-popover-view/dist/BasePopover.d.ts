import { Component, ReactNode } from 'react';
import { Animated, EasingFunction } from 'react-native';
import { Geometry } from './Geometry';
import { Point, PopoverProps, Rect, Size } from './Types';
declare type BasePopoverProps = Omit<PopoverProps, 'displayAreaInsets'> & {
    displayArea: Rect;
    showBackground?: boolean;
    fromRect: Rect | null;
    onDisplayAreaChanged: (rect: Rect) => void;
    skipMeasureContent: () => boolean;
};
interface BasePopoverState {
    requestedContentSize: Size | null;
    activeGeom: Geometry | undefined;
    nextGeom: Geometry | undefined;
    showing: boolean;
    animatedValues: {
        scale: Animated.Value;
        translate: Animated.ValueXY;
        fade: Animated.Value;
        translateArrow: Animated.ValueXY;
    };
}
export default class BasePopover extends Component<BasePopoverProps, BasePopoverState> {
    state: BasePopoverState;
    private _isMounted;
    private animating;
    private animateOutAfterShow;
    private popoverRef;
    private arrowRef;
    private handleChangeTimeout?;
    debug(line: string, obj?: unknown): void;
    componentDidMount(): void;
    componentDidUpdate(prevProps: BasePopoverProps): void;
    componentWillUnmount(): void;
    measureContent(requestedContentSize: Size): void;
    handleChange(): void;
    static getPolarity(): -1 | 1;
    getGeom(): Geometry;
    getTranslateOrigin(): Point;
    animateOut(): void;
    animateIn(): void;
    animateTo(args: {
        fade: number;
        scale: number;
        translatePoint: Point;
        callback?: () => void;
        easing: EasingFunction;
        values: {
            scale: Animated.Value;
            translate: Animated.ValueXY;
            fade: Animated.Value;
            translateArrow: Animated.ValueXY;
        };
        geom: Geometry;
    }): void;
    render(): ReactNode;
}
export {};
