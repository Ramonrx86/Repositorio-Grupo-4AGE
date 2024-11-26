import { Component, ReactNode, RefObject } from 'react';
import { View } from 'react-native';
import { PopoverProps, Rect, ModalPopoverState } from './Types';
interface JSModalPopoverProps extends PopoverProps {
    showBackground: boolean;
    fromRect?: Rect;
    fromRef?: RefObject<View>;
    displayArea?: Rect;
}
export default class JSModalPopover extends Component<JSModalPopoverProps, ModalPopoverState> {
    state: {
        visible: boolean;
    };
    private containerRef;
    componentDidMount(): void;
    componentDidUpdate(prevProps: JSModalPopoverProps): void;
    render(): ReactNode;
}
export {};
