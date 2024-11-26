import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Placement, Size } from './Types';
export declare type ArrowProps = {
    placement: Placement;
    color: ViewStyle['backgroundColor'];
    arrowSize: Size;
    positionStyle: Pick<ViewStyle, 'top' | 'bottom' | 'left' | 'right'>;
    elevation?: number;
};
declare const Arrow: React.ForwardRefExoticComponent<ArrowProps & React.RefAttributes<View>>;
export default Arrow;
