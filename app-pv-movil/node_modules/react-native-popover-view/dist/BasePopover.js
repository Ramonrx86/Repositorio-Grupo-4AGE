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
import { Animated, Easing, I18nManager, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Arrow from './Arrow';
import { DEBUG, DEFAULT_ARROW_SIZE, FIX_SHIFT, isWeb, styles } from './Constants';
import { computeGeometry, Geometry } from './Geometry';
import { Placement, Point, Rect, Size } from './Types';
import { getChangedProps, getRectForRef } from './Utility';
var BasePopover = /** @class */ (function (_super) {
    __extends(BasePopover, _super);
    function BasePopover() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            requestedContentSize: null,
            activeGeom: undefined,
            nextGeom: undefined,
            showing: false,
            animatedValues: {
                scale: new Animated.Value(0),
                translate: new Animated.ValueXY(),
                fade: new Animated.Value(0),
                translateArrow: new Animated.ValueXY()
            }
        };
        _this._isMounted = false;
        _this.animating = false;
        _this.animateOutAfterShow = false;
        _this.popoverRef = React.createRef();
        _this.arrowRef = React.createRef();
        return _this;
    }
    BasePopover.prototype.debug = function (line, obj) {
        if (DEBUG || this.props.debug)
            console.log("[" + (new Date()).toISOString() + "] " + line + (obj ? ": " + JSON.stringify(obj) : ''));
    };
    BasePopover.prototype.componentDidMount = function () {
        this._isMounted = true;
    };
    BasePopover.prototype.componentDidUpdate = function (prevProps) {
        // Make sure a value we care about has actually changed
        var importantProps = ['isVisible', 'fromRect', 'displayArea', 'verticalOffset', 'offset', 'placement'];
        var changedProps = getChangedProps(this.props, prevProps, importantProps);
        if (!changedProps.length)
            return;
        this.debug('[BasePopover] componentDidUpdate - changedProps', changedProps);
        if (this.props.isVisible !== prevProps.isVisible) {
            this.debug("componentDidUpdate - isVisible changed, now " + this.props.isVisible);
            if (!this.props.isVisible) {
                if (this.state.showing)
                    this.animateOut();
                else
                    this.animateOutAfterShow = true;
                this.debug('componentDidUpdate - Hiding popover');
            }
        }
        else if (this.props.isVisible && prevProps.isVisible) {
            this.debug('componentDidUpdate - isVisible not changed, handling other changes');
            this.handleChange();
        }
    };
    BasePopover.prototype.componentWillUnmount = function () {
        this._isMounted = false;
        if (this.state.showing) {
            this.debug('componentWillUnmount');
            this.animateOut();
        }
    };
    BasePopover.prototype.measureContent = function (requestedContentSize) {
        var _this = this;
        if (!requestedContentSize.width) {
            console.warn("Popover Warning - Can't Show - The Popover content has a width of 0, so there is nothing to present.");
            return;
        }
        if (!requestedContentSize.height) {
            console.warn("Popover Warning - Can't Show - The Popover content has a height of 0, so there is nothing to present.");
            return;
        }
        if (this.props.skipMeasureContent()) {
            this.debug("measureContent - Skipping, waiting for resize to finish");
            return;
        }
        if (!this.state.requestedContentSize ||
            !requestedContentSize.equals(this.state.requestedContentSize)) {
            this.debug("measureContent - new requestedContentSize: " + JSON.stringify(requestedContentSize) + " (used to be " + JSON.stringify(this.state.requestedContentSize) + ")");
            this.setState({ requestedContentSize: requestedContentSize }, function () { return _this.handleChange(); });
        }
        else {
            this.debug("measureContent - Skipping, content size did not change");
        }
    };
    /*
     * Many factors may cause the geometry to change.
     * This function collects all of them, waiting for 200ms after the last change,
     * then takes action, either bringing up the popover or moving it to its new location
     */
    BasePopover.prototype.handleChange = function () {
        var _this = this;
        if (this.handleChangeTimeout)
            clearTimeout(this.handleChangeTimeout);
        /*
         * This function will be called again once we have a requested content size,
         * so safe to ignore for now
         */
        if (!this.state.requestedContentSize) {
            this.debug('handleChange - no requestedContentSize, exiting...');
            return;
        }
        this.debug('handleChange - waiting 100ms to accumulate all changes');
        this.handleChangeTimeout = setTimeout(function () {
            var _a = _this.state, activeGeom = _a.activeGeom, animatedValues = _a.animatedValues, requestedContentSize = _a.requestedContentSize;
            var _b = _this.props, arrowSize = _b.arrowSize, popoverStyle = _b.popoverStyle, fromRect = _b.fromRect, displayArea = _b.displayArea, placement = _b.placement, onOpenStart = _b.onOpenStart, arrowShift = _b.arrowShift, onPositionChange = _b.onPositionChange, offset = _b.offset, popoverShift = _b.popoverShift;
            if (requestedContentSize) {
                _this.debug('handleChange - requestedContentSize', requestedContentSize);
                _this.debug('handleChange - displayArea', displayArea);
                _this.debug('handleChange - fromRect', fromRect);
                if (placement)
                    _this.debug('handleChange - placement', placement.toString());
                var geom_1 = computeGeometry({
                    requestedContentSize: requestedContentSize,
                    placement: placement,
                    fromRect: fromRect,
                    displayArea: displayArea,
                    arrowSize: arrowSize || DEFAULT_ARROW_SIZE,
                    popoverStyle: popoverStyle,
                    arrowShift: arrowShift,
                    debug: _this.debug.bind(_this),
                    previousPlacement: _this.getGeom().placement,
                    offset: offset,
                    popoverShift: popoverShift
                });
                _this.setState({ nextGeom: geom_1, requestedContentSize: requestedContentSize }, function () {
                    if (geom_1.viewLargerThanDisplayArea.width || geom_1.viewLargerThanDisplayArea.height) {
                        /*
                         * If the view initially overflowed the display area,
                         * wait one more render cycle to test-render it within
                         * the display area to get final calculations for popoverOrigin before show
                         */
                        _this.debug('handleChange - delaying showing popover because viewLargerThanDisplayArea');
                    }
                    else if (!activeGeom) {
                        _this.debug('handleChange - animating in');
                        if (onOpenStart)
                            setTimeout(onOpenStart);
                        _this.animateIn();
                    }
                    else if (activeGeom && !Geometry.equals(activeGeom, geom_1)) {
                        var moveTo = new Point(geom_1.popoverOrigin.x, geom_1.popoverOrigin.y);
                        _this.debug('handleChange - Triggering popover move to', moveTo);
                        _this.animateTo({
                            values: animatedValues,
                            fade: 1,
                            scale: 1,
                            translatePoint: moveTo,
                            easing: Easing.inOut(Easing.quad),
                            geom: geom_1,
                            callback: onPositionChange
                        });
                    }
                    else {
                        _this.debug('handleChange - no change');
                    }
                });
            }
        }, 100);
    };
    BasePopover.getPolarity = function () {
        return I18nManager.isRTL ? -1 : 1;
    };
    BasePopover.prototype.getGeom = function () {
        var _a = this.state, activeGeom = _a.activeGeom, nextGeom = _a.nextGeom;
        if (activeGeom)
            return activeGeom;
        if (nextGeom)
            return nextGeom;
        return new Geometry({
            popoverOrigin: new Point(0, 0),
            anchorPoint: new Point(0, 0),
            placement: Placement.AUTO,
            forcedContentSize: new Size(0, 0),
            viewLargerThanDisplayArea: {
                width: false,
                height: false
            }
        });
    };
    BasePopover.prototype.getTranslateOrigin = function () {
        var requestedContentSize = this.state.requestedContentSize;
        var arrowSize = this.props.arrowSize || DEFAULT_ARROW_SIZE;
        var _a = this.getGeom(), forcedContentSize = _a.forcedContentSize, viewLargerThanDisplayArea = _a.viewLargerThanDisplayArea, anchorPoint = _a.anchorPoint, placement = _a.placement;
        var viewWidth = 0;
        if (viewLargerThanDisplayArea.width && (forcedContentSize === null || forcedContentSize === void 0 ? void 0 : forcedContentSize.width))
            viewWidth = forcedContentSize.width;
        else if (requestedContentSize === null || requestedContentSize === void 0 ? void 0 : requestedContentSize.width)
            viewWidth = requestedContentSize.width;
        if ([Placement.LEFT, Placement.RIGHT].includes(placement))
            viewWidth += arrowSize.height;
        var viewHeight = 0;
        if (viewLargerThanDisplayArea.height && (forcedContentSize === null || forcedContentSize === void 0 ? void 0 : forcedContentSize.height))
            viewHeight = forcedContentSize.height;
        else if (requestedContentSize === null || requestedContentSize === void 0 ? void 0 : requestedContentSize.height)
            viewHeight = requestedContentSize.height;
        if ([Placement.TOP, Placement.BOTTOM].includes(placement))
            viewHeight += arrowSize.height;
        this.debug('getTranslateOrigin - popoverSize', { width: viewWidth, height: viewHeight });
        this.debug('getTranslateOrigin - anchorPoint', anchorPoint);
        return new Point(anchorPoint.x - (viewWidth / 2), anchorPoint.y - (viewHeight / 2));
    };
    BasePopover.prototype.animateOut = function () {
        var _this = this;
        if (this.props.onCloseStart)
            setTimeout(this.props.onCloseStart);
        if (this._isMounted)
            this.setState({ showing: false });
        this.debug('animateOut - isMounted', this._isMounted);
        this.animateTo({
            values: this.state.animatedValues,
            fade: 0,
            scale: 0,
            translatePoint: this.getTranslateOrigin(),
            callback: function () { return setTimeout(_this.props.onCloseComplete); },
            easing: Easing.inOut(Easing.quad),
            geom: this.getGeom()
        });
    };
    BasePopover.prototype.animateIn = function () {
        var _this = this;
        var nextGeom = this.state.nextGeom;
        if (nextGeom !== undefined && nextGeom instanceof Geometry) {
            var values = this.state.animatedValues;
            // Should grow from anchor point
            var translateStart = this.getTranslateOrigin();
            // eslint-disable-next-line
            translateStart.y += FIX_SHIFT; // Temp fix for useNativeDriver issue
            values.translate.setValue(translateStart);
            var translatePoint = new Point(nextGeom.popoverOrigin.x, nextGeom.popoverOrigin.y);
            this.debug('animateIn - translateStart', translateStart);
            this.debug('animateIn - translatePoint', translatePoint);
            this.animateTo({
                values: values,
                fade: 1,
                scale: 1,
                translatePoint: translatePoint,
                easing: Easing.out(Easing.back(1)),
                geom: nextGeom,
                callback: function () {
                    if (_this._isMounted) {
                        _this.setState({ showing: true });
                        if (_this.props.debug || DEBUG) {
                            setTimeout(function () {
                                return _this.popoverRef.current &&
                                    getRectForRef(_this.popoverRef).then(function (rect) { return _this.debug('animateIn - onOpenComplete - Calculated Popover Rect', rect); });
                            });
                            setTimeout(function () {
                                return _this.arrowRef.current &&
                                    getRectForRef(_this.arrowRef).then(function (rect) { return _this.debug('animateIn - onOpenComplete - Calculated Arrow Rect', rect); });
                            });
                        }
                    }
                    if (_this.props.onOpenComplete)
                        setTimeout(_this.props.onOpenComplete);
                    if (_this.animateOutAfterShow || !_this._isMounted) {
                        _this.animateOut();
                        _this.animateOutAfterShow = false;
                    }
                }
            });
        }
    };
    BasePopover.prototype.animateTo = function (args) {
        var _this = this;
        var fade = args.fade, translatePoint = args.translatePoint, scale = args.scale, callback = args.callback, easing = args.easing, values = args.values;
        var commonConfig = __assign({ duration: 300, easing: easing, useNativeDriver: !isWeb }, this.props.animationConfig);
        if (this.animating) {
            setTimeout(function () { return _this.animateTo(args); }, 100);
            return;
        }
        // eslint-disable-next-line
        translatePoint.y = translatePoint.y + FIX_SHIFT; // Temp fix for useNativeDriver issue
        if (!fade && fade !== 0) {
            console.log('Popover: Fade value is null');
            return;
        }
        if (!translatePoint) {
            console.log('Popover: Translate Point value is null');
            return;
        }
        if (!scale && scale !== 0) {
            console.log('Popover: Scale value is null');
            return;
        }
        this.animating = true;
        Animated.parallel([
            Animated.timing(values.fade, __assign(__assign({}, commonConfig), { toValue: fade })),
            Animated.timing(values.translate, __assign(__assign({}, commonConfig), { toValue: translatePoint })),
            Animated.timing(values.scale, __assign(__assign({}, commonConfig), { toValue: scale }))
        ]).start(function () {
            _this.animating = false;
            if (_this._isMounted)
                _this.setState({ activeGeom: _this.state.nextGeom });
            if (callback)
                callback();
        });
    };
    BasePopover.prototype.render = function () {
        var _this = this;
        var _a = this.state, animatedValues = _a.animatedValues, nextGeom = _a.nextGeom, requestedContentSize = _a.requestedContentSize;
        var flattenedPopoverStyle = StyleSheet.flatten(this.props.popoverStyle);
        var arrowSize = this.props.arrowSize || DEFAULT_ARROW_SIZE;
        var geom = this.getGeom();
        var transformStyle = __assign(__assign({ position: 'absolute' }, requestedContentSize), { transform: [
                { translateX: animatedValues.translate.x },
                { translateY: animatedValues.translate.y },
                { scale: animatedValues.scale }
            ] });
        var shadowOffset = flattenedPopoverStyle.shadowOffset, shadowColor = flattenedPopoverStyle.shadowColor, shadowOpacity = flattenedPopoverStyle.shadowOpacity, shadowRadius = flattenedPopoverStyle.shadowRadius, elevation = flattenedPopoverStyle.elevation, otherPopoverStyles = __rest(flattenedPopoverStyle, ["shadowOffset", "shadowColor", "shadowOpacity", "shadowRadius", "elevation"]);
        var shadowStyle = {
            shadowOffset: shadowOffset,
            shadowColor: shadowColor,
            shadowOpacity: shadowOpacity,
            shadowRadius: shadowRadius
        };
        var contentWrapperStyle = __assign(__assign(__assign({}, styles.popoverContent), otherPopoverStyles), { elevation: elevation });
        /*
         * We want to always use next here, because the we need this to re-render
         * before we can animate to the correct spot for the active.
         */
        if (nextGeom) {
            contentWrapperStyle.maxWidth = nextGeom.forcedContentSize.width;
            contentWrapperStyle.maxHeight = nextGeom.forcedContentSize.height;
        }
        var arrowPositionStyle = {};
        if (geom.placement === Placement.RIGHT || geom.placement === Placement.LEFT) {
            arrowPositionStyle.top = geom.anchorPoint.y - geom.popoverOrigin.y - arrowSize.height;
            if (transformStyle.width)
                transformStyle.width += arrowSize.height;
            if (geom.placement === Placement.RIGHT)
                contentWrapperStyle.left = arrowSize.height;
        }
        else if (geom.placement === Placement.TOP || geom.placement === Placement.BOTTOM) {
            arrowPositionStyle.left = geom.anchorPoint.x - geom.popoverOrigin.x - (arrowSize.width / 2);
            if (transformStyle.height)
                transformStyle.height += arrowSize.height;
            if (geom.placement === Placement.BOTTOM)
                contentWrapperStyle.top = arrowSize.height;
        }
        switch (geom.placement) {
            case Placement.TOP:
                arrowPositionStyle.bottom = 0;
                break;
            case Placement.BOTTOM:
                arrowPositionStyle.top = 0;
                break;
            case Placement.LEFT:
                arrowPositionStyle.right = 0;
                break;
            case Placement.RIGHT:
                arrowPositionStyle.left = 0;
                break;
            default:
        }
        // Temp fix for useNativeDriver issue
        var backgroundShift = animatedValues.fade.interpolate({
            inputRange: [0, 0.0001, 1],
            outputRange: [0, FIX_SHIFT, FIX_SHIFT]
        });
        var backgroundStyle = __assign(__assign(__assign({}, styles.background), { transform: [{ translateY: backgroundShift }] }), StyleSheet.flatten(this.props.backgroundStyle));
        var containerStyle = __assign(__assign({}, styles.container), { opacity: animatedValues.fade });
        var backgroundColor = flattenedPopoverStyle.backgroundColor ||
            styles.popoverContent.backgroundColor;
        return (React.createElement(View, { pointerEvents: "box-none", style: [styles.container, { top: -1 * FIX_SHIFT }] },
            React.createElement(View, { pointerEvents: "box-none", style: [styles.container, { top: FIX_SHIFT, flex: 1 }], onLayout: function (evt) { return _this.props.onDisplayAreaChanged(new Rect(evt.nativeEvent.layout.x, evt.nativeEvent.layout.y - FIX_SHIFT, evt.nativeEvent.layout.width, evt.nativeEvent.layout.height)); } }),
            React.createElement(Animated.View, { pointerEvents: "box-none", style: containerStyle },
                this.props.showBackground !== false && (React.createElement(TouchableWithoutFeedback, { onPress: this.props.onRequestClose },
                    React.createElement(Animated.View, { style: backgroundStyle }))),
                React.createElement(View, { pointerEvents: "box-none", style: __assign({ top: 0, left: 0 }, shadowStyle) },
                    React.createElement(Animated.View, { style: transformStyle },
                        React.createElement(View, { ref: this.popoverRef, style: contentWrapperStyle, onLayout: function (evt) {
                                var layout = __assign({}, evt.nativeEvent.layout);
                                setTimeout(function () { return _this._isMounted &&
                                    _this.measureContent(new Size(layout.width, layout.height)); }, 10);
                            } }, this.props.children),
                        geom.placement !== Placement.FLOATING &&
                            React.createElement(Arrow, { ref: this.arrowRef, placement: geom.placement, color: backgroundColor, arrowSize: arrowSize, positionStyle: arrowPositionStyle, elevation: elevation }))))));
    };
    return BasePopover;
}(Component));
export default BasePopover;
//# sourceMappingURL=BasePopover.js.map