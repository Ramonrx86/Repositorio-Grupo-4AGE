import React from 'react';
import { Animated, View, ViewStyle } from 'react-native';
export interface MenuProps {
    children?: React.ReactNode;
    anchor?: React.ReactNode;
    style?: ViewStyle;
    onRequestClose?(): void;
    animationDuration?: number;
    testID?: string;
    visible?: boolean;
}
declare enum States {
    Hidden = 0,
    Animating = 1,
    Shown = 2
}
interface State {
    buttonHeight: number;
    buttonWidth: number;
    left: number;
    menuHeight: number;
    menuSizeAnimation: Animated.ValueXY;
    menuState: States;
    menuWidth: number;
    opacityAnimation: Animated.Value;
    top: number;
}
export declare class Menu extends React.Component<MenuProps, State> {
    _container: View | null;
    static defaultProps: {
        animationDuration: number;
    };
    constructor(props: MenuProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: MenuProps): void;
    private setContainerRef;
    private onMenuLayout;
    private show;
    private hide;
    private onRequestClose;
    render(): JSX.Element;
}
export {};
