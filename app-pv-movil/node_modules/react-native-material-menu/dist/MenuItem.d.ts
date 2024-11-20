import React from 'react';
import { PressableProps, TextStyle, ViewStyle } from 'react-native';
export declare type MenuItemProps = {
    children: React.ReactNode;
    disabled?: boolean;
    disabledTextColor?: string;
    pressColor?: string;
    style?: ViewStyle;
    textStyle?: TextStyle;
} & PressableProps;
export declare function MenuItem({ children, disabled, disabledTextColor, onPress, pressColor, style, textStyle, ...props }: MenuItemProps): JSX.Element;
