var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import { Rect, Placement, Mode, Size } from './Types';
import { DEFAULT_ARROW_SIZE } from './Constants';
import JSModalPopover from './JSModalPopover';
import RNModalPopover from './RNModalPopover';
var Popover = /** @class */ (function (_super) {
    __extends(Popover, _super);
    function Popover() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isVisible: false
        };
        _this.sourceRef = React.createRef();
        return _this;
    }
    Popover.prototype.requestClose = function () {
        if (this.props.onRequestClose)
            this.props.onRequestClose();
        this.setState({
            isVisible: false
        });
    };
    Popover.prototype.render = function () {
        var _this = this;
        var _a = this.props, mode = _a.mode, from = _a.from, isVisible = _a.isVisible, onRequestClose = _a.onRequestClose, placement = _a.placement, arrowSize = _a.arrowSize, displayArea = _a.displayArea, otherProps = __rest(_a, ["mode", "from", "isVisible", "onRequestClose", "placement", "arrowSize", "displayArea"]);
        var actualIsVisible = isVisible === undefined
            ? this.state.isVisible
            : isVisible;
        var fromRect;
        var fromRef;
        var sourceElement;
        if (from) {
            if (typeof from === 'object' && (from.x || from.x === 0) && (from.y || from.y === 0)) {
                if ((from.width || from.width === 0) && (from.height || from.height === 0)) {
                    var fromAsRect = from;
                    fromRect = new Rect(fromAsRect.x, fromAsRect.y, fromAsRect.width, fromAsRect.height);
                }
                else {
                    fromRect = new Rect(from.x, from.y, 0, 0);
                }
            }
            else if ({}.hasOwnProperty.call(from, 'current')) {
                fromRef = from;
            }
            else if (typeof from === 'function') {
                var element = from(this.sourceRef, function () { return _this.setState({ isVisible: true }); });
                if (React.isValidElement(element)) {
                    sourceElement = element;
                    fromRef = this.sourceRef;
                }
            }
            else if (React.isValidElement(from)) {
                if (isVisible === undefined) {
                    sourceElement = React.cloneElement(from, { onPress: function () { return _this.setState({ isVisible: true }); } });
                }
                else {
                    sourceElement = from;
                }
                fromRef = this.sourceRef;
            }
            else {
                console.warn('Popover: `from` prop is an invalid value. Pass a React element, Rect, RefObject, or function that returns a React element.');
            }
        }
        if (sourceElement) {
            sourceElement = React.cloneElement(sourceElement, { ref: this.sourceRef });
        }
        var modalProps = __assign(__assign({}, otherProps), { fromRect: fromRect,
            fromRef: fromRef, isVisible: actualIsVisible, arrowSize: arrowSize ? new Size(arrowSize === null || arrowSize === void 0 ? void 0 : arrowSize.width, arrowSize === null || arrowSize === void 0 ? void 0 : arrowSize.height) : undefined, displayArea: displayArea
                ? new Rect(displayArea.x, displayArea.y, displayArea.width, displayArea.height)
                : undefined, onRequestClose: function () {
                if (onRequestClose)
                    onRequestClose();
                _this.setState({ isVisible: false });
            }, 
            // Handle changing CENTER -> FLOATING until CENTER is removed
            placement: placement === Placement.CENTER ? Placement.FLOATING : placement });
        if (mode === Mode.RN_MODAL) {
            return (React.createElement(React.Fragment, null,
                sourceElement,
                React.createElement(RNModalPopover, __assign({}, modalProps))));
        }
        return (React.createElement(React.Fragment, null,
            sourceElement,
            React.createElement(JSModalPopover, __assign({ showBackground: mode !== Mode.TOOLTIP }, modalProps))));
    };
    Popover.propTypes = {
        // display
        isVisible: PropTypes.bool,
        // anchor
        from: PropTypes.oneOfType([
            PropTypes.instanceOf(Rect),
            PropTypes.func,
            PropTypes.node,
            PropTypes.shape({ current: PropTypes.any })
        ]),
        // config
        displayArea: PropTypes.oneOfType([
            PropTypes.exact({
                x: PropTypes.number,
                y: PropTypes.number,
                width: PropTypes.number,
                height: PropTypes.number
            })
        ]),
        displayAreaInsets: PropTypes.shape({
            left: PropTypes.number,
            right: PropTypes.number,
            top: PropTypes.number,
            bottom: PropTypes.number
        }),
        placement: PropTypes.oneOfType([
            PropTypes.oneOf([
                Placement.LEFT,
                Placement.RIGHT,
                Placement.TOP,
                Placement.BOTTOM,
                Placement.AUTO,
                Placement.FLOATING,
                Placement.CENTER
            ]),
            PropTypes.arrayOf(PropTypes.oneOf([
                Placement.LEFT,
                Placement.RIGHT,
                Placement.TOP,
                Placement.BOTTOM,
                Placement.AUTO,
                Placement.FLOATING,
                Placement.CENTER
            ]))
        ]),
        animationConfig: PropTypes.object,
        verticalOffset: PropTypes.number,
        // style
        popoverStyle: ViewPropTypes.style,
        popoverShift: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number
        }),
        backgroundStyle: ViewPropTypes.style,
        arrowSize: PropTypes.shape({
            width: PropTypes.number,
            height: PropTypes.number
        }),
        arrowShift: PropTypes.number,
        // lifecycle
        onOpenStart: PropTypes.func,
        onOpenComplete: PropTypes.func,
        onRequestClose: PropTypes.func,
        onCloseStart: PropTypes.func,
        onCloseComplete: PropTypes.func,
        onPositionChange: PropTypes.func,
        debug: PropTypes.bool
    };
    Popover.defaultProps = {
        mode: Mode.RN_MODAL,
        placement: Placement.AUTO,
        verticalOffset: 0,
        popoverStyle: {},
        arrowSize: DEFAULT_ARROW_SIZE,
        backgroundStyle: {},
        debug: false
    };
    return Popover;
}(Component));
export default Popover;
//# sourceMappingURL=Popover.js.map