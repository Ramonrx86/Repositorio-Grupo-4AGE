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
import React, { Component } from 'react';
import { Modal } from 'react-native';
import AdaptivePopover from './AdaptivePopover';
import { MULTIPLE_POPOVER_WARNING } from './Constants';
import { Point } from './Types';
var RNModalPopover = /** @class */ (function (_super) {
    __extends(RNModalPopover, _super);
    function RNModalPopover() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            visible: false
        };
        return _this;
    }
    RNModalPopover.prototype.componentDidMount = function () {
        if (this.props.isVisible) {
            if (RNModalPopover.isShowingInModal)
                console.warn(MULTIPLE_POPOVER_WARNING);
            else
                this.setState({ visible: true });
        }
    };
    RNModalPopover.prototype.componentDidUpdate = function (prevProps, prevState) {
        if (this.props.isVisible && !prevProps.isVisible) {
            if (RNModalPopover.isShowingInModal)
                console.warn(MULTIPLE_POPOVER_WARNING);
            else
                this.setState({ visible: true });
        }
        if (!this.state.visible && prevState.visible && this.props.onCloseComplete) {
            /*
             * Don't run this callback until after update, so that <Modal> is no longer active
             * Need to wait 50ms to make sure <Modal> is completely gone, in case
             * we want to show another popover immediately after
             */
            setTimeout(this.props.onCloseComplete, 50);
        }
    };
    RNModalPopover.prototype.render = function () {
        var _this = this;
        var _a = this.props, statusBarTranslucent = _a.statusBarTranslucent, onCloseStart = _a.onCloseStart, onRequestClose = _a.onRequestClose;
        var visible = this.state.visible;
        return (React.createElement(Modal, { transparent: true, supportedOrientations: ['portrait', 'portrait-upside-down', 'landscape'], hardwareAccelerated: true, visible: visible, statusBarTranslucent: statusBarTranslucent, onShow: function () {
                RNModalPopover.isShowingInModal = true;
            }, 
            // Handles android back button
            onRequestClose: onRequestClose },
            React.createElement(AdaptivePopover, __assign({}, this.props, { onCloseStart: function () {
                    RNModalPopover.isShowingInModal = false;
                    if (onCloseStart)
                        onCloseStart();
                }, onCloseComplete: function () { return _this.setState({ visible: false }); }, getDisplayAreaOffset: function () { return Promise.resolve(new Point(0, 0)); } }))));
    };
    RNModalPopover.isShowingInModal = false;
    return RNModalPopover;
}(Component));
export default RNModalPopover;
//# sourceMappingURL=RNModalPopover.js.map