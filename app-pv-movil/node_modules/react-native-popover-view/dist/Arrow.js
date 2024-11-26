var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React from 'react';
import { View } from 'react-native';
import { Placement } from './Types';
var Arrow = React.forwardRef(function (props, ref) {
    var _a;
    var placement = props.placement, color = props.color, arrowSize = props.arrowSize, positionStyle = props.positionStyle, elevation = props.elevation;
    /*
     * Make width and height slightly bigger so that it overlaps popover to eliminate seem
     * (unless transparency is in play, in which case the overlap would show)
     */
    var isTransparent = color
        ? color.toString() === 'transparent' ||
            color.toString().startsWith('rgba') ||
            color.toString().startsWith('hsla') ||
            (color.toString().startsWith('#') && color.toString().length > 7)
        : false;
    var width = arrowSize.width + (isTransparent ? 0 : 2);
    var height = arrowSize.height + (isTransparent ? 0 : 2);
    // Flip width and height when showing on side to account for inner transform
    var placeLeftOrRight = [Placement.LEFT, Placement.RIGHT].includes(placement);
    var arrowOuterStyle = __assign({ position: 'absolute', width: placeLeftOrRight ? height : width, height: placeLeftOrRight ? width : height, overflow: 'hidden', elevation: elevation }, positionStyle);
    // Create a triangle using borders
    var arrowInnerStyle = (_a = {
            position: 'absolute'
        },
        _a[placement] = 0,
        _a.borderBottomColor = color,
        _a.borderRightColor = 'transparent',
        _a.borderLeftColor = 'transparent',
        _a.width = width,
        _a.height = height * 2,
        _a.borderBottomWidth = height,
        _a.borderRightWidth = width / 2,
        _a.borderLeftWidth = width / 2,
        _a);
    // Rotate to show the triangle in different directions
    switch (placement) {
        case Placement.TOP:
            arrowInnerStyle.transform = [{ rotateZ: '180deg' }];
            break;
        case Placement.LEFT:
            arrowInnerStyle.transform = [{ rotateZ: '90deg' }];
            break;
        case Placement.RIGHT:
            arrowInnerStyle.transform = [{ rotateZ: '270deg' }];
            break;
        default:
    }
    return (React.createElement(View, { style: arrowOuterStyle, ref: ref },
        React.createElement(View, { style: arrowInnerStyle })));
});
export default Arrow;
//# sourceMappingURL=Arrow.js.map