import { Component, ReactNode, RefObject } from 'react';
import { View } from 'react-native';
import { Point, PopoverProps, Rect } from './Types';
interface AdaptivePopoverState {
    fromRect: Rect | null;
    shiftedDisplayArea: Rect | null;
    defaultDisplayArea: Rect | null;
    displayAreaOffset: Point | null;
    showing: boolean;
}
declare type AdaptivePopoverProps = PopoverProps & {
    fromRect?: Rect;
    fromRef?: RefObject<View>;
    displayArea?: Rect;
    getDisplayAreaOffset: () => Promise<Point>;
    showBackground?: boolean;
};
export default class AdaptivePopover extends Component<AdaptivePopoverProps, AdaptivePopoverState> {
    state: {
        fromRect: null;
        shiftedDisplayArea: null;
        defaultDisplayArea: null;
        displayAreaOffset: null;
        showing: boolean;
    };
    getUnshiftedDisplayArea(): Rect;
    getDisplayArea(): Rect;
    private waitForResizeToFinish;
    private skipNextDefaultDisplayArea;
    private displayAreaStore;
    private _isMounted;
    private keyboardDidHideSubscription;
    private keyboardDidShowSubscription;
    private handleResizeEventSubscription;
    constructor(props: AdaptivePopoverProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(prevProps: AdaptivePopoverProps): void;
    handleResizeEvent(change: unknown): void;
    debug(line: string, obj?: unknown): void;
    setDefaultDisplayArea(newDisplayArea: Rect): Promise<void>;
    keyboardDidShow(e: {
        endCoordinates: {
            height: number;
        };
    }): void;
    keyboardDidHide(): void;
    shiftForKeyboard(keyboardHeight: number): void;
    calculateRectFromRef(): Promise<void>;
    static hasRetrievedSatisfyingRect: (rect: Rect, initialRect: Rect) => boolean;
    render(): ReactNode;
}
export {};
