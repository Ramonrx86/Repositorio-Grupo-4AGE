import { Component, PropsWithChildren, RefObject, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { ViewProps } from 'react-native';
import { Rect, PopoverProps, Placement, Mode, Point, Size } from './Types';
export interface PublicPopoverProps extends PropsWithChildren<Omit<PopoverProps, 'displayArea' | 'arrowSize'>> {
    displayArea?: Pick<Rect, 'x' | 'y' | 'width' | 'height'>;
    arrowSize?: Pick<Size, 'width' | 'height'>;
    mode?: Mode;
    from?: Rect | RefObject<Component> | ((sourceRef: RefObject<Component>, openPopover: () => void) => ReactNode) | ReactNode | Point;
    testID?: ViewProps['testID'];
}
interface PublicPopoverState {
    isVisible: boolean;
}
export default class Popover extends Component<PublicPopoverProps, PublicPopoverState> {
    static propTypes: {
        isVisible: PropTypes.Requireable<boolean>;
        from: PropTypes.Requireable<string | number | boolean | {} | PropTypes.ReactElementLike | PropTypes.ReactNodeArray>;
        displayArea: PropTypes.Requireable<Required<PropTypes.InferProps<{
            x: PropTypes.Requireable<number>;
            y: PropTypes.Requireable<number>;
            width: PropTypes.Requireable<number>;
            height: PropTypes.Requireable<number>;
        }>>>;
        displayAreaInsets: PropTypes.Requireable<PropTypes.InferProps<{
            left: PropTypes.Requireable<number>;
            right: PropTypes.Requireable<number>;
            top: PropTypes.Requireable<number>;
            bottom: PropTypes.Requireable<number>;
        }>>;
        placement: PropTypes.Requireable<Placement | (Placement | null | undefined)[]>;
        animationConfig: PropTypes.Requireable<object>;
        verticalOffset: PropTypes.Requireable<number>;
        popoverStyle: any;
        popoverShift: PropTypes.Requireable<PropTypes.InferProps<{
            x: PropTypes.Requireable<number>;
            y: PropTypes.Requireable<number>;
        }>>;
        backgroundStyle: any;
        arrowSize: PropTypes.Requireable<PropTypes.InferProps<{
            width: PropTypes.Requireable<number>;
            height: PropTypes.Requireable<number>;
        }>>;
        arrowShift: PropTypes.Requireable<number>;
        onOpenStart: PropTypes.Requireable<(...args: any[]) => any>;
        onOpenComplete: PropTypes.Requireable<(...args: any[]) => any>;
        onRequestClose: PropTypes.Requireable<(...args: any[]) => any>;
        onCloseStart: PropTypes.Requireable<(...args: any[]) => any>;
        onCloseComplete: PropTypes.Requireable<(...args: any[]) => any>;
        onPositionChange: PropTypes.Requireable<(...args: any[]) => any>;
        debug: PropTypes.Requireable<boolean>;
    };
    static defaultProps: Partial<PublicPopoverProps>;
    state: {
        isVisible: boolean;
    };
    requestClose(): void;
    private sourceRef;
    render(): ReactNode;
}
export {};
