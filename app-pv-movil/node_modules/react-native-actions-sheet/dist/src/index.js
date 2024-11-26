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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/* eslint-disable curly */
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, } from 'react';
import { Animated, BackHandler, Dimensions, Easing, Keyboard, Modal, PanResponder, Platform, SafeAreaView, StatusBar, TouchableOpacity, View, } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, } from 'react-native-gesture-handler';
import { DraggableNodesContext, PanGestureRefContext, } from './context';
import EventManager, { actionSheetEventManager } from './eventmanager';
import { RouterContext, RouterParamsContext, useRouter, } from './hooks/use-router';
import { resolveScrollRef, ScrollState } from './hooks/use-scroll-handlers';
import useSheetManager from './hooks/use-sheet-manager';
import { useKeyboard } from './hooks/useKeyboard';
import { SheetProvider, useProviderContext, useSheetIDContext, useSheetPayload, useSheetRef, } from './provider';
import { getZIndexFromStack, isRenderedOnTop, SheetManager, } from './sheetmanager';
import { styles } from './styles';
import { getElevation, SUPPORTED_ORIENTATIONS } from './utils';
var EVENTS_INTERNAL = {
    safeAreaLayout: 'safeAreaLayout',
};
export default forwardRef(function ActionSheet(_a, ref) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    var _r = _a.animated, animated = _r === void 0 ? true : _r, _s = _a.closeOnPressBack, closeOnPressBack = _s === void 0 ? true : _s, _t = _a.springOffset, springOffset = _t === void 0 ? 50 : _t, _u = _a.elevation, elevation = _u === void 0 ? 5 : _u, _v = _a.defaultOverlayOpacity, defaultOverlayOpacity = _v === void 0 ? 0.3 : _v, _w = _a.overlayColor, overlayColor = _w === void 0 ? 'black' : _w, _x = _a.closable, closable = _x === void 0 ? true : _x, _y = _a.closeOnTouchBackdrop, closeOnTouchBackdrop = _y === void 0 ? true : _y, onTouchBackdrop = _a.onTouchBackdrop, _z = _a.drawUnderStatusBar, drawUnderStatusBar = _z === void 0 ? false : _z, _0 = _a.gestureEnabled, gestureEnabled = _0 === void 0 ? false : _0, _1 = _a.isModal, isModal = _1 === void 0 ? true : _1, _2 = _a.snapPoints, snapPoints = _2 === void 0 ? [100] : _2, _3 = _a.initialSnapIndex, initialSnapIndex = _3 === void 0 ? 0 : _3, _4 = _a.overdrawEnabled, overdrawEnabled = _4 === void 0 ? true : _4, _5 = _a.overdrawFactor, overdrawFactor = _5 === void 0 ? 15 : _5, _6 = _a.overdrawSize, overdrawSize = _6 === void 0 ? 100 : _6, _7 = _a.zIndex, zIndex = _7 === void 0 ? 999 : _7, _8 = _a.keyboardHandlerEnabled, keyboardHandlerEnabled = _8 === void 0 ? true : _8, ExtraOverlayComponent = _a.ExtraOverlayComponent, payload = _a.payload, safeAreaInsets = _a.safeAreaInsets, routes = _a.routes, initialRoute = _a.initialRoute, onBeforeShow = _a.onBeforeShow, enableRouterBackNavigation = _a.enableRouterBackNavigation, onBeforeClose = _a.onBeforeClose, _9 = _a.enableGesturesInScrollView, enableGesturesInScrollView = _9 === void 0 ? true : _9, disableDragBeyondMinimumSnapPoint = _a.disableDragBeyondMinimumSnapPoint, props = __rest(_a, ["animated", "closeOnPressBack", "springOffset", "elevation", "defaultOverlayOpacity", "overlayColor", "closable", "closeOnTouchBackdrop", "onTouchBackdrop", "drawUnderStatusBar", "gestureEnabled", "isModal", "snapPoints", "initialSnapIndex", "overdrawEnabled", "overdrawFactor", "overdrawSize", "zIndex", "keyboardHandlerEnabled", "ExtraOverlayComponent", "payload", "safeAreaInsets", "routes", "initialRoute", "onBeforeShow", "enableRouterBackNavigation", "onBeforeClose", "enableGesturesInScrollView", "disableDragBeyondMinimumSnapPoint"]);
    snapPoints =
        snapPoints[snapPoints.length - 1] !== 100
            ? __spreadArray(__spreadArray([], snapPoints, true), [100], false) : snapPoints;
    var initialValue = useRef(-1);
    var actionSheetHeight = useRef(0);
    var safeAreaPaddings = useRef(safeAreaInsets || {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    });
    var internalEventManager = React.useMemo(function () { return new EventManager(); }, []);
    var currentContext = useProviderContext();
    var currentSnapIndex = useRef(initialSnapIndex);
    var sheetRef = useSheetRef();
    var dimensionsRef = useRef({
        width: 0,
        height: 0,
        portrait: true,
    });
    var minTranslateValue = useRef(0);
    var keyboardWasVisible = useRef(false);
    var prevKeyboardHeight = useRef(0);
    var id = useSheetIDContext();
    var sheetId = props.id || id;
    var lock = useRef(false);
    var panViewRef = useRef(null);
    var rootViewContainerRef = useRef(null);
    var gestureBoundaries = useRef({});
    var hiding = useRef(false);
    var payloadRef = useRef(payload);
    var sheetPayload = useSheetPayload();
    var panHandlerRef = useRef();
    var closing = useRef(false);
    var draggableNodes = useRef([]);
    var sheetLayoutRef = useRef();
    var _10 = useState({
        width: Dimensions.get('window').width,
        height: 0,
        portrait: true,
        paddingBottom: (props === null || props === void 0 ? void 0 : props.useBottomSafeAreaPadding) ? 25 : 0,
    }), dimensions = _10[0], setDimensions = _10[1];
    var rootViewLayoutEventValues = useRef({});
    if (safeAreaInsets) {
        safeAreaPaddings.current = safeAreaInsets;
    }
    var _11 = useSheetManager({
        id: sheetId,
        onHide: function (data) {
            hideSheet(undefined, data, true);
        },
        onBeforeShow: function (data) {
            var _a;
            (_a = routerRef.current) === null || _a === void 0 ? void 0 : _a.initialNavigation();
            onBeforeShow === null || onBeforeShow === void 0 ? void 0 : onBeforeShow(data);
        },
        onContextUpdate: function () {
            if (sheetId) {
                SheetManager.add(sheetId, currentContext);
                SheetManager.registerRef(sheetId, currentContext, {
                    current: getRef(),
                });
            }
        },
    }), visible = _11.visible, setVisible = _11.setVisible;
    var animations = useMemo(function () { return ({
        opacity: new Animated.Value(0),
        translateY: new Animated.Value(0),
        underlayTranslateY: new Animated.Value(100),
        keyboardTranslate: new Animated.Value(0),
        routeOpacity: new Animated.Value(0),
    }); }, []);
    var animationListeners = useRef({});
    var router = useRouter({
        routes: routes,
        getRef: function () { return getRef(); },
        initialRoute: initialRoute,
        onNavigate: props.onNavigate,
        onNavigateBack: props.onNavigateBack,
        routeOpacity: animations.routeOpacity,
    });
    var routerRef = useRef(router);
    payloadRef.current = payload;
    routerRef.current = router;
    var keyboard = useKeyboard(keyboardHandlerEnabled);
    var prevSnapIndex = useRef(initialSnapIndex);
    var draggableNodesContext = React.useMemo(function () { return ({
        nodes: draggableNodes,
    }); }, []);
    var notifyOffsetChange = function (value) {
        internalEventManager.publish('onoffsetchange', value);
    };
    var notifySnapIndexChanged = React.useCallback(function () {
        var _a;
        if (prevSnapIndex.current !== currentSnapIndex.current) {
            prevSnapIndex.current = currentSnapIndex.current;
            (_a = props.onSnapIndexChange) === null || _a === void 0 ? void 0 : _a.call(props, currentSnapIndex.current);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.onSnapIndexChange]);
    var returnAnimation = React.useCallback(function (velocity) {
        if (!animated) {
            animations.translateY.setValue(initialValue.current);
            return;
        }
        var config = props.openAnimationConfig;
        var correctedValue = initialValue.current > minTranslateValue.current
            ? initialValue.current
            : 0;
        notifyOffsetChange(correctedValue);
        if (!config) {
            Animated.spring(animations.translateY, __assign(__assign({ toValue: initialValue.current, useNativeDriver: true, friction: 8 }, config), { velocity: typeof velocity !== 'number' ? undefined : velocity })).start();
        }
        else {
            Animated.spring(animations.translateY, __assign(__assign({ toValue: initialValue.current, useNativeDriver: true }, config), { velocity: typeof velocity !== 'number' ? undefined : velocity })).start();
        }
        notifySnapIndexChanged();
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [animated, props.openAnimationConfig]);
    var opacityAnimation = React.useCallback(function (opacity) {
        Animated.timing(animations.opacity, {
            duration: 150,
            easing: Easing.in(Easing.ease),
            toValue: opacity,
            useNativeDriver: true,
        }).start();
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    var hideAnimation = React.useCallback(function (vy, callback) {
        if (!animated) {
            callback === null || callback === void 0 ? void 0 : callback({ finished: true });
            return;
        }
        var config = props.closeAnimationConfig;
        opacityAnimation(0);
        var animation = Animated.spring(animations.translateY, __assign({ velocity: typeof vy !== 'number' ? 3.0 : vy + 1, toValue: dimensionsRef.current.height * 1.3, useNativeDriver: true }, config));
        animation.start();
        setTimeout(function () {
            animation.stop();
            callback === null || callback === void 0 ? void 0 : callback({ finished: true });
        }, 150);
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [animated, opacityAnimation, props.closeAnimationConfig]);
    var getCurrentPosition = React.useCallback(function () {
        //@ts-ignore
        return animations.translateY._value <= minTranslateValue.current + 5
            ? 0
            : //@ts-ignore
                animations.translateY._value;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    var getNextPosition = React.useCallback(function (snapIndex) {
        return (actionSheetHeight.current +
            minTranslateValue.current -
            (actionSheetHeight.current * snapPoints[snapIndex]) / 100);
    }, [snapPoints]);
    var hardwareBackPressEvent = useRef();
    var Root = isModal && !(props === null || props === void 0 ? void 0 : props.backgroundInteractionEnabled) ? Modal : Animated.View;
    useEffect(function () {
        var animationListener;
        if (drawUnderStatusBar || props.onChange) {
            animationListener = animations.translateY.addListener(function (value) {
                var _a;
                var correctedValue = value.value > minTranslateValue.current ? value.value - minTranslateValue.current : 0;
                (_a = props === null || props === void 0 ? void 0 : props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, correctedValue, actionSheetHeight.current);
                if (drawUnderStatusBar) {
                    if (lock.current)
                        return;
                    var correctedHeight = keyboard.keyboardShown
                        ? dimensionsRef.current.height -
                            (keyboard.keyboardHeight + safeAreaPaddings.current.bottom)
                        : dimensionsRef.current.height - safeAreaPaddings.current.bottom;
                    if (actionSheetHeight.current >= correctedHeight - 1) {
                        if (value.value < 100) {
                            animations.underlayTranslateY.setValue(Math.max(value.value - 20, -20));
                        }
                        else {
                            //@ts-ignore
                            if (animations.underlayTranslateY._value !== 100) {
                                animations.underlayTranslateY.setValue(100);
                            }
                        }
                    }
                    else {
                        //@ts-ignore
                        if (animations.underlayTranslateY._value !== 100) {
                            animations.underlayTranslateY.setValue(100);
                        }
                    }
                }
            });
        }
        animationListeners.current.translateY = animationListener;
        return function () {
            animationListener &&
                animations.translateY.removeListener(animationListener);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props === null || props === void 0 ? void 0 : props.id, keyboard.keyboardShown, keyboard.keyboardHeight]);
    var onSheetLayout = React.useCallback(function (event) {
        var _a, _b;
        sheetLayoutRef.current = __assign({}, event.nativeEvent.layout);
        if (rootViewLayoutEventValues.current.resizing)
            return;
        if (closing.current)
            return;
        var rootViewHeight = (_a = dimensionsRef.current) === null || _a === void 0 ? void 0 : _a.height;
        actionSheetHeight.current =
            event.nativeEvent.layout.height > dimensionsRef.current.height
                ? dimensionsRef.current.height
                : event.nativeEvent.layout.height;
        minTranslateValue.current =
            rootViewHeight -
                (actionSheetHeight.current + safeAreaPaddings.current.bottom);
        if (initialValue.current < 0) {
            animations.translateY.setValue(rootViewHeight * 1.1);
        }
        var nextInitialValue = actionSheetHeight.current +
            minTranslateValue.current -
            (actionSheetHeight.current * snapPoints[currentSnapIndex.current]) /
                100;
        initialValue.current =
            (keyboard.keyboardShown || keyboardWasVisible.current) &&
                initialValue.current <= nextInitialValue &&
                initialValue.current >= minTranslateValue.current
                ? initialValue.current
                : nextInitialValue;
        var sheetBottomEdgePosition = initialValue.current +
            (actionSheetHeight.current * snapPoints[currentSnapIndex.current]) /
                100;
        var sheetPositionWithKeyboard = sheetBottomEdgePosition -
            (((_b = dimensionsRef.current) === null || _b === void 0 ? void 0 : _b.height) - keyboard.keyboardHeight);
        initialValue.current =
            sheetPositionWithKeyboard > 0
                ? initialValue.current - sheetPositionWithKeyboard
                : initialValue.current;
        if (keyboard.keyboardShown) {
            minTranslateValue.current =
                minTranslateValue.current -
                    (keyboard.keyboardHeight + safeAreaPaddings.current.bottom);
            keyboardWasVisible.current = true;
            prevKeyboardHeight.current = keyboard.keyboardHeight;
        }
        else {
            keyboardWasVisible.current = false;
        }
        opacityAnimation(1);
        setTimeout(function () {
            returnAnimation();
        }, 1);
        if (initialValue.current > 100) {
            if (lock.current)
                return;
            animations.underlayTranslateY.setValue(100);
        }
        if (Platform.OS === 'web') {
            document.body.style.overflowY = 'hidden';
            document.documentElement.style.overflowY = 'hidden';
        }
    }, [
        snapPoints,
        keyboard.keyboardShown,
        keyboard.keyboardHeight,
        opacityAnimation,
        animations.translateY,
        animations.underlayTranslateY,
        returnAnimation,
    ]);
    var onRootViewLayout = React.useCallback(function (event) {
        var _a, _b;
        if (keyboard.keyboardShown && !isModal) {
            return;
        }
        rootViewLayoutEventValues.current.resizing = true;
        var rootViewHeight = event.nativeEvent.layout.height;
        var rootViewWidth = event.nativeEvent.layout.width;
        (_a = rootViewLayoutEventValues.current.sub) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        rootViewLayoutEventValues.current.sub = internalEventManager.subscribe(EVENTS_INTERNAL.safeAreaLayout, function () {
            var _a;
            (_a = rootViewLayoutEventValues.current.sub) === null || _a === void 0 ? void 0 : _a.unsubscribe();
            var safeMarginFromTop = Platform.OS === 'ios'
                ? safeAreaPaddings.current.top < 20
                    ? 20
                    : safeAreaPaddings.current.top
                : StatusBar.currentHeight || 0;
            var height = rootViewHeight - safeMarginFromTop;
            var width = rootViewWidth;
            dimensionsRef.current = {
                width: width,
                height: height,
                portrait: width < height,
            };
            setDimensions(__assign({}, dimensionsRef.current));
            rootViewLayoutEventValues.current.resizing = false;
            if (sheetLayoutRef.current) {
                onSheetLayout({
                    nativeEvent: {
                        layout: sheetLayoutRef.current,
                    },
                });
            }
        });
        clearTimeout(rootViewLayoutEventValues.current.timer);
        clearTimeout(rootViewLayoutEventValues.current.layouTimer);
        if (safeAreaPaddings.current.top !== undefined ||
            Platform.OS !== 'ios') {
            rootViewLayoutEventValues.current.layouTimer = setTimeout(function () {
                internalEventManager.publish(EVENTS_INTERNAL.safeAreaLayout);
            }, Platform.OS === 'ios' ||
                rootViewLayoutEventValues.current.firstEventFired
                ? 0
                : 300);
        }
        if (!((_b = rootViewLayoutEventValues.current) === null || _b === void 0 ? void 0 : _b.firstEventFired)) {
            rootViewLayoutEventValues.current.firstEventFired = true;
        }
    }, [keyboard.keyboardShown, isModal, internalEventManager, onSheetLayout]);
    var hideSheet = React.useCallback(function (vy, data, isSheetManagerOrRef) {
        if (hiding.current)
            return;
        if (!closable && !isSheetManagerOrRef) {
            returnAnimation(vy);
            return;
        }
        hiding.current = true;
        onBeforeClose === null || onBeforeClose === void 0 ? void 0 : onBeforeClose((data || payloadRef.current || data));
        setTimeout(function () {
            if (closable) {
                closing.current = true;
                Keyboard.dismiss();
                animationListeners.current.translateY &&
                    animations.translateY.removeListener(animationListeners.current.translateY);
                animationListeners.current.translateY = undefined;
            }
            hideAnimation(vy, function (_a) {
                var _b, _c;
                var finished = _a.finished;
                if (finished) {
                    if (closable || isSheetManagerOrRef) {
                        setVisible(false);
                        if (props.onClose) {
                            (_b = props.onClose) === null || _b === void 0 ? void 0 : _b.call(props, (data || payloadRef.current || data));
                            hiding.current = false;
                        }
                        (_c = hardwareBackPressEvent.current) === null || _c === void 0 ? void 0 : _c.remove();
                        if (sheetId) {
                            SheetManager.remove(sheetId, currentContext);
                            hiding.current = false;
                            actionSheetEventManager.publish("onclose_".concat(sheetId), data || payloadRef.current || data, currentContext);
                        }
                        else {
                            hiding.current = false;
                        }
                        currentSnapIndex.current = initialSnapIndex;
                        closing.current = false;
                        setTimeout(function () {
                            keyboard.reset();
                        });
                    }
                    else {
                        animations.opacity.setValue(1);
                        returnAnimation();
                    }
                }
            });
        }, 1);
        if (Platform.OS === 'web') {
            document.body.style.overflowY = 'auto';
            document.documentElement.style.overflowY = 'auto';
        }
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
        closable,
        hideAnimation,
        props.onClose,
        returnAnimation,
        setVisible,
        keyboard,
    ]);
    var onHardwareBackPress = React.useCallback(function () {
        var _a, _b;
        if (visible &&
            enableRouterBackNavigation &&
            ((_a = routerRef.current) === null || _a === void 0 ? void 0 : _a.canGoBack())) {
            (_b = routerRef.current) === null || _b === void 0 ? void 0 : _b.goBack();
            return true;
        }
        if (visible && closable && closeOnPressBack) {
            hideSheet();
            return true;
        }
        return false;
    }, [
        closable,
        closeOnPressBack,
        hideSheet,
        enableRouterBackNavigation,
        visible,
    ]);
    /**
     * Snap towards the top
     */
    var snapForward = React.useCallback(function (vy) {
        if (currentSnapIndex.current === snapPoints.length - 1) {
            initialValue.current = getNextPosition(currentSnapIndex.current);
            returnAnimation(vy);
            return;
        }
        var nextSnapPoint = 0;
        var nextSnapIndex = 0;
        if (getCurrentPosition() === 0) {
            nextSnapPoint = snapPoints[(nextSnapIndex = snapPoints.length - 1)];
        }
        else {
            for (var i = currentSnapIndex.current; i < snapPoints.length; i++) {
                if (getNextPosition(i) < getCurrentPosition()) {
                    nextSnapPoint = snapPoints[(nextSnapIndex = i)];
                    break;
                }
            }
        }
        if (nextSnapPoint > 100) {
            console.warn('Snap points should range between 0 to 100.');
            returnAnimation(vy);
            return;
        }
        currentSnapIndex.current = nextSnapIndex;
        initialValue.current = getNextPosition(currentSnapIndex.current);
        returnAnimation(vy);
    }, [getCurrentPosition, getNextPosition, returnAnimation, snapPoints]);
    /**
     * Snap towards the bottom
     */
    var snapBackward = React.useCallback(function (vy) {
        if (currentSnapIndex.current === 0) {
            if (closable) {
                initialValue.current = dimensionsRef.current.height * 1.3;
                hideSheet(vy);
            }
            else {
                initialValue.current = getNextPosition(currentSnapIndex.current);
                returnAnimation(vy);
            }
            return;
        }
        var nextSnapPoint = 0;
        var nextSnapIndex = 0;
        for (var i = currentSnapIndex.current; i > -1; i--) {
            if (getNextPosition(i) > getCurrentPosition()) {
                nextSnapPoint = snapPoints[(nextSnapIndex = i)];
                break;
            }
        }
        if (nextSnapPoint < 0) {
            console.warn('Snap points should range between 0 to 100.');
            returnAnimation(vy);
            return;
        }
        currentSnapIndex.current = nextSnapIndex;
        initialValue.current = getNextPosition(currentSnapIndex.current);
        returnAnimation(vy);
    }, [
        closable,
        getCurrentPosition,
        getNextPosition,
        hideSheet,
        returnAnimation,
        snapPoints,
    ]);
    function getRectBoundary(rect) {
        if (rect) {
            var w = rect.w, h = rect.h, px = rect.px, py = rect.py;
            return __assign(__assign({}, rect), { boundryX: px + w, boundryY: py + h });
        }
        return { w: 0, h: 0, px: 0, py: 0, x: 0, y: 0, boundryX: 0, boundryY: 0 };
    }
    var getActiveDraggableNodes = React.useCallback(function (absoluteX, absoluteY) {
        var _a;
        if (((_a = draggableNodes.current) === null || _a === void 0 ? void 0 : _a.length) === 0)
            return [];
        var activeNodes = [];
        for (var _i = 0, _b = draggableNodes.current; _i < _b.length; _i++) {
            var node = _b[_i];
            var rect = getRectBoundary(node.rect.current);
            if (rect.boundryX === 0 && rect.boundryY === 0)
                continue;
            if (absoluteX > rect.px &&
                absoluteY > rect.py &&
                absoluteX < rect.boundryX &&
                absoluteY < rect.boundryY) {
                activeNodes.push({
                    rectWithBoundry: rect,
                    node: node,
                });
            }
        }
        return activeNodes;
    }, []);
    var panHandlers = React.useMemo(function () {
        var velocity = 0;
        var prevDeltaY = 0;
        var offsets = [];
        var lockGesture = false;
        var gestureEventCounter = 0;
        var isScrollingGesture = false;
        var deltaYOnGestureStart = 0;
        var start;
        function scrollable(value) {
            if (Platform.OS === 'ios')
                return;
            for (var i = 0; i < draggableNodes.current.length; i++) {
                var node = draggableNodes.current[i];
                var scrollRef = resolveScrollRef(node.ref);
                scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.setNativeProps({
                    scrollEnabled: value,
                });
            }
        }
        return Platform.OS === 'web'
            ? { enabled: false }
            : {
                onBegan: function () {
                    if (Platform.OS === 'android') {
                        scrollable(false);
                    }
                },
                onGestureEvent: function (event) {
                    var _a, _b;
                    if (sheetId && !isRenderedOnTop(sheetId, currentContext))
                        return;
                    var gesture = event.nativeEvent;
                    var deltaY = gesture.translationY;
                    var swipingDown = prevDeltaY < deltaY;
                    prevDeltaY = deltaY;
                    if (!start) {
                        start = {
                            x: event.nativeEvent.absoluteX,
                            y: event.nativeEvent.absoluteY,
                        };
                    }
                    var activeDraggableNodes = getActiveDraggableNodes(start.x, start.y);
                    var isFullOpen = getCurrentPosition() === 0;
                    var blockSwipeGesture = false;
                    if (activeDraggableNodes.length > 0) {
                        if (isFullOpen) {
                            if (swipingDown) {
                                for (var _i = 0, activeDraggableNodes_1 = activeDraggableNodes; _i < activeDraggableNodes_1.length; _i++) {
                                    var node = activeDraggableNodes_1[_i];
                                    if (!node.node.offset.current)
                                        continue;
                                    var y = node.node.offset.current.y;
                                    if (y === ScrollState.END) {
                                        blockSwipeGesture = true;
                                        continue;
                                    }
                                    if (y < 1 && node.node.handlerConfig.hasRefreshControl) {
                                        // Refresh Control will work in to 15% area of the DraggableNode.
                                        var refreshControlBounds = node.rectWithBoundry.py +
                                            node.rectWithBoundry.h *
                                                node.node.handlerConfig.refreshControlBoundary;
                                        if (!refreshControlBounds)
                                            continue;
                                        if (event.nativeEvent.absoluteY < refreshControlBounds) {
                                            lockGesture = true;
                                            blockSwipeGesture = false;
                                            continue;
                                        }
                                        else {
                                            blockSwipeGesture = false;
                                            continue;
                                        }
                                    }
                                    if (y > 1) {
                                        blockSwipeGesture = true;
                                        continue;
                                    }
                                }
                            }
                            else {
                                for (var _c = 0, activeDraggableNodes_2 = activeDraggableNodes; _c < activeDraggableNodes_2.length; _c++) {
                                    var node = activeDraggableNodes_2[_c];
                                    if (!node.node.offset.current)
                                        continue;
                                    var y = node.node.offset.current.y;
                                    // Swiping up
                                    // 1. Scroll if the scroll container has not reached end
                                    // 2. Don't scroll if sheet has not reached the top
                                    if (
                                    // Scroll has not reached end
                                    y !== ScrollState.END) {
                                        blockSwipeGesture = true;
                                        continue;
                                    }
                                }
                            }
                        }
                    }
                    gestureEventCounter++;
                    if (isFullOpen && (blockSwipeGesture || lockGesture)) {
                        isScrollingGesture = true;
                        scrollable(true);
                        return;
                    }
                    var startY = event.nativeEvent.y - event.nativeEvent.translationY;
                    if (!enableGesturesInScrollView && startY > 100) {
                        return;
                    }
                    if (gestureEventCounter < 2) {
                        return;
                    }
                    if (swipingDown || !isFullOpen) {
                        if (Platform.OS === 'ios') {
                            for (var i = 0; i < draggableNodes.current.length; i++) {
                                var node = draggableNodes.current[i];
                                var scrollRef = resolveScrollRef(node.ref);
                                if (!offsets[i] || ((_a = node.offset.current) === null || _a === void 0 ? void 0 : _a.y) === 0) {
                                    offsets[i] = ((_b = node.offset.current) === null || _b === void 0 ? void 0 : _b.y) || 0;
                                }
                                scrollRef.scrollTo({
                                    x: 0,
                                    y: offsets[i],
                                    animated: false,
                                });
                            }
                        }
                    }
                    if (!isFullOpen) {
                        isScrollingGesture = false;
                        blockSwipeGesture = false;
                    }
                    if (isScrollingGesture && !swipingDown) {
                        return scrollable(true);
                    }
                    else {
                        scrollable(false);
                    }
                    isScrollingGesture = false;
                    if (!deltaYOnGestureStart) {
                        deltaYOnGestureStart = deltaY;
                    }
                    deltaY = deltaY - deltaYOnGestureStart;
                    var value = initialValue.current + deltaY;
                    velocity = 1;
                    var correctedValue = 
                    //@ts-ignore
                    value <= minTranslateValue.current
                        ? //@ts-ignore
                            minTranslateValue.current - value
                        : //@ts-ignore
                            value;
                    if (
                    //@ts-ignore
                    correctedValue / overdrawFactor >= overdrawSize &&
                        deltaY <= 0) {
                        return;
                    }
                    var minSnapPoint = getNextPosition(0);
                    var translateYValue = value <= minTranslateValue.current
                        ? overdrawEnabled
                            ? minTranslateValue.current -
                                correctedValue / overdrawFactor
                            : minTranslateValue.current
                        : value;
                    if (!closable && disableDragBeyondMinimumSnapPoint) {
                        animations.translateY.setValue(translateYValue >= minSnapPoint
                            ? minSnapPoint
                            : translateYValue);
                    }
                    else {
                        animations.translateY.setValue(translateYValue);
                    }
                },
                failOffsetX: [-20, 20],
                activeOffsetY: [-5, 5],
                onEnded: function () {
                    deltaYOnGestureStart = 0;
                    offsets = [];
                    start = undefined;
                    isScrollingGesture = false;
                    gestureEventCounter = 0;
                    lockGesture = false;
                    var isMovingUp = getCurrentPosition() < initialValue.current;
                    // When finger is lifted, we enable scrolling on all
                    // scrollable nodes again
                    scrollable(true);
                    if ((!isMovingUp &&
                        getCurrentPosition() < initialValue.current + springOffset) ||
                        (isMovingUp &&
                            getCurrentPosition() > initialValue.current - springOffset)) {
                        returnAnimation(1);
                        velocity = 0;
                        return;
                    }
                    if (!isMovingUp) {
                        snapBackward(velocity);
                    }
                    else {
                        snapForward(velocity);
                    }
                    velocity = 0;
                },
                enabled: gestureEnabled,
            };
    }, [
        animations.translateY,
        closable,
        currentContext,
        disableDragBeyondMinimumSnapPoint,
        enableGesturesInScrollView,
        gestureEnabled,
        getActiveDraggableNodes,
        getCurrentPosition,
        getNextPosition,
        overdrawEnabled,
        overdrawFactor,
        overdrawSize,
        returnAnimation,
        sheetId,
        snapBackward,
        snapForward,
        springOffset,
    ]);
    var handlers = React.useMemo(function () {
        var prevDeltaY = 0;
        var lockGesture = false;
        var offsets = [];
        var start;
        var deltaYOnGestureStart = 0;
        return !gestureEnabled || Platform.OS !== 'web'
            ? { panHandlers: {} }
            : PanResponder.create({
                onMoveShouldSetPanResponder: function (_event, gesture) {
                    if (sheetId && !isRenderedOnTop(sheetId, currentContext))
                        return false;
                    var vy = gesture.vy < 0 ? gesture.vy * -1 : gesture.vy;
                    var vx = gesture.vx < 0 ? gesture.vx * -1 : gesture.vx;
                    if (vy < 0.05 || vx > 0.05) {
                        return false;
                    }
                    var activeDraggableNodes = getActiveDraggableNodes(_event.nativeEvent.pageX, _event.nativeEvent.pageY);
                    for (var _i = 0, activeDraggableNodes_3 = activeDraggableNodes; _i < activeDraggableNodes_3.length; _i++) {
                        var node = activeDraggableNodes_3[_i];
                        var scrollRef = resolveScrollRef(node.node.ref);
                        offsets.push(scrollRef.scrollTop);
                    }
                    return true;
                },
                onStartShouldSetPanResponder: function (_event, _gesture) {
                    if (sheetId && !isRenderedOnTop(sheetId, currentContext))
                        return false;
                    var activeDraggableNodes = getActiveDraggableNodes(_event.nativeEvent.pageX, _event.nativeEvent.pageY);
                    for (var _i = 0, activeDraggableNodes_4 = activeDraggableNodes; _i < activeDraggableNodes_4.length; _i++) {
                        var node = activeDraggableNodes_4[_i];
                        var scrollRef = resolveScrollRef(node.node.ref);
                        offsets.push(scrollRef.scrollTop);
                    }
                    return true;
                },
                onPanResponderMove: function (_event, gesture) {
                    var deltaY = gesture.dy;
                    var swipingDown = prevDeltaY < deltaY;
                    prevDeltaY = deltaY;
                    var isFullOpen = getCurrentPosition() === 0;
                    var blockSwipeGesture = false;
                    if (!start) {
                        start = {
                            x: _event.nativeEvent.pageX,
                            y: _event.nativeEvent.pageY,
                        };
                    }
                    var activeDraggableNodes = getActiveDraggableNodes(start.x, start.y);
                    if (activeDraggableNodes.length > 0) {
                        if (isFullOpen) {
                            if (swipingDown) {
                                for (var i = 0; i < activeDraggableNodes.length; i++) {
                                    var node = activeDraggableNodes[i];
                                    if (!node.node.offset.current)
                                        continue;
                                    var y = node.node.offset.current.y;
                                    if (y === ScrollState.END) {
                                        blockSwipeGesture = true;
                                        var scrollRef = resolveScrollRef(node.node.ref);
                                        offsets[i] = scrollRef.scrollTop;
                                        continue;
                                    }
                                    if (y === 0 &&
                                        node.node.handlerConfig.hasRefreshControl) {
                                        // Refresh Control will work in to 15% area of the DraggableNode.
                                        var refreshControlBounds = node.rectWithBoundry.py +
                                            node.rectWithBoundry.h *
                                                node.node.handlerConfig.refreshControlBoundary;
                                        if (!refreshControlBounds)
                                            continue;
                                        if (_event.nativeEvent.pageY < refreshControlBounds) {
                                            lockGesture = true;
                                            blockSwipeGesture = false;
                                            continue;
                                        }
                                        else {
                                            blockSwipeGesture = false;
                                            continue;
                                        }
                                    }
                                    if (y > 5) {
                                        blockSwipeGesture = true;
                                        var scrollRef = resolveScrollRef(node.node.ref);
                                        offsets[i] = scrollRef.scrollTop;
                                        continue;
                                    }
                                }
                            }
                            else {
                                for (var i = 0; i < activeDraggableNodes.length; i++) {
                                    var node = activeDraggableNodes[i];
                                    if (!node.node.offset.current)
                                        continue;
                                    var y = node.node.offset.current.y;
                                    if (y > -1) {
                                        blockSwipeGesture = true;
                                        continue;
                                    }
                                }
                            }
                        }
                        else {
                            for (var i = 0; i < activeDraggableNodes.length; i++) {
                                var node = activeDraggableNodes[i];
                                var scrollRef = resolveScrollRef(node.node.ref);
                                scrollRef.scrollTop = offsets[i];
                            }
                        }
                    }
                    if (blockSwipeGesture || lockGesture) {
                        return;
                    }
                    var startY = gesture.moveY - gesture.dy;
                    if (!enableGesturesInScrollView && startY > 100) {
                        return;
                    }
                    if (!deltaYOnGestureStart) {
                        deltaYOnGestureStart = deltaY;
                    }
                    deltaY = deltaY - deltaYOnGestureStart;
                    var value = initialValue.current + deltaY;
                    var correctedValue = 
                    //@ts-ignore
                    value <= minTranslateValue.current
                        ? //@ts-ignore
                            minTranslateValue.current - value
                        : //@ts-ignore
                            value;
                    if (
                    //@ts-ignore
                    correctedValue / overdrawFactor >= overdrawSize &&
                        gesture.dy <= 0) {
                        return;
                    }
                    var minSnapPoint = getNextPosition(0);
                    var translateYValue = value <= minTranslateValue.current
                        ? overdrawEnabled
                            ? minTranslateValue.current -
                                correctedValue / overdrawFactor
                            : minTranslateValue.current
                        : value;
                    if (!closable && disableDragBeyondMinimumSnapPoint) {
                        animations.translateY.setValue(translateYValue >= minSnapPoint
                            ? minSnapPoint
                            : translateYValue);
                    }
                    else {
                        animations.translateY.setValue(translateYValue);
                    }
                },
                onPanResponderEnd: function (_event, gesture) {
                    start = undefined;
                    offsets = [];
                    prevDeltaY = 0;
                    deltaYOnGestureStart = 0;
                    var isMovingUp = getCurrentPosition() < initialValue.current;
                    if ((!isMovingUp &&
                        getCurrentPosition() < initialValue.current + springOffset) ||
                        (isMovingUp &&
                            getCurrentPosition() > initialValue.current - springOffset)) {
                        returnAnimation(gesture.vy);
                        return;
                    }
                    if (!isMovingUp) {
                        snapBackward(gesture.vy);
                    }
                    else {
                        snapForward(gesture.vy);
                    }
                },
            });
    }, [
        gestureEnabled,
        sheetId,
        currentContext,
        getActiveDraggableNodes,
        getCurrentPosition,
        enableGesturesInScrollView,
        overdrawFactor,
        overdrawSize,
        getNextPosition,
        overdrawEnabled,
        closable,
        disableDragBeyondMinimumSnapPoint,
        animations.translateY,
        springOffset,
        returnAnimation,
        snapBackward,
        snapForward,
    ]);
    var onTouch = function (event) {
        onTouchBackdrop === null || onTouchBackdrop === void 0 ? void 0 : onTouchBackdrop(event);
        if (enableRouterBackNavigation && router.canGoBack()) {
            router.goBack();
            return;
        }
        if (closeOnTouchBackdrop && closable) {
            hideSheet();
        }
    };
    var getRef = useCallback(function () { return ({
        show: function (snapIndex) {
            var _a;
            if (typeof snapIndex === 'number') {
                currentSnapIndex.current = snapIndex;
            }
            onBeforeShow === null || onBeforeShow === void 0 ? void 0 : onBeforeShow();
            (_a = routerRef.current) === null || _a === void 0 ? void 0 : _a.initialNavigation();
            setVisible(true);
        },
        hide: function (data) {
            hideSheet(undefined, data, true);
        },
        setModalVisible: function (_visible) {
            if (_visible) {
                setVisible(true);
            }
            else {
                hideSheet();
            }
        },
        snapToOffset: function (offset) {
            initialValue.current =
                actionSheetHeight.current +
                    minTranslateValue.current -
                    (actionSheetHeight.current * offset) / 100;
            Animated.spring(animations.translateY, __assign({ toValue: initialValue.current, useNativeDriver: true }, props.openAnimationConfig)).start();
        },
        snapToRelativeOffset: function (offset) {
            if (offset === 0) {
                getRef().snapToIndex(currentSnapIndex.current);
                return;
            }
            var availableHeight = actionSheetHeight.current + minTranslateValue.current;
            initialValue.current =
                initialValue.current + initialValue.current * (offset / 100);
            if (initialValue.current > availableHeight) {
                getRef().snapToOffset(100);
                return;
            }
            Animated.spring(animations.translateY, __assign({ toValue: initialValue.current, useNativeDriver: true }, props.openAnimationConfig)).start();
        },
        snapToIndex: function (index) {
            if (index > snapPoints.length || index < 0)
                return;
            currentSnapIndex.current = index;
            initialValue.current = getNextPosition(index);
            Animated.spring(animations.translateY, __assign({ toValue: initialValue.current, useNativeDriver: true }, props.openAnimationConfig)).start();
            notifySnapIndexChanged();
        },
        handleChildScrollEnd: function () {
            console.warn('handleChildScrollEnd has been removed. Please use `useScrollHandlers` hook to enable scrolling in ActionSheet');
        },
        modifyGesturesForLayout: function (_id, layout, scrollOffset) {
            //@ts-ignore
            gestureBoundaries.current[_id] = __assign(__assign({}, layout), { scrollOffset: scrollOffset });
        },
        currentSnapIndex: function () { return currentSnapIndex.current; },
        isGestureEnabled: function () { return gestureEnabled; },
        isOpen: function () { return visible; },
        keyboardHandler: function (enabled) {
            keyboard.pauseKeyboardHandler.current = enabled;
        },
        ev: internalEventManager,
    }); }, [
        internalEventManager,
        onBeforeShow,
        setVisible,
        hideSheet,
        animations.translateY,
        props.openAnimationConfig,
        snapPoints.length,
        getNextPosition,
        notifySnapIndexChanged,
        gestureEnabled,
        visible,
        keyboard.pauseKeyboardHandler,
    ]);
    useImperativeHandle(ref, getRef, [getRef]);
    useEffect(function () {
        if (sheetId) {
            SheetManager.registerRef(sheetId, currentContext, {
                current: getRef(),
            });
        }
        sheetRef.current = getRef();
    }, [currentContext, getRef, sheetId, sheetRef]);
    var onRequestClose = React.useCallback(function () {
        var _a, _b;
        if (enableRouterBackNavigation && ((_a = routerRef.current) === null || _a === void 0 ? void 0 : _a.canGoBack())) {
            (_b = routerRef.current) === null || _b === void 0 ? void 0 : _b.goBack();
            return;
        }
        if (visible && closeOnPressBack) {
            hideSheet();
        }
    }, [hideSheet, enableRouterBackNavigation, closeOnPressBack, visible]);
    var rootProps = React.useMemo(function () {
        var _a, _b;
        return isModal && !props.backgroundInteractionEnabled
            ? {
                visible: true,
                animationType: 'none',
                testID: ((_a = props.testIDs) === null || _a === void 0 ? void 0 : _a.modal) || props.testID,
                supportedOrientations: SUPPORTED_ORIENTATIONS,
                onShow: props.onOpen,
                onRequestClose: onRequestClose,
                transparent: true,
                /**
                 * Always true, it causes issue with keyboard handling.
                 */
                statusBarTranslucent: true,
            }
            : {
                testID: ((_b = props.testIDs) === null || _b === void 0 ? void 0 : _b.root) || props.testID,
                onLayout: function () {
                    var _a;
                    hardwareBackPressEvent.current = BackHandler.addEventListener('hardwareBackPress', onHardwareBackPress);
                    (_a = props === null || props === void 0 ? void 0 : props.onOpen) === null || _a === void 0 ? void 0 : _a.call(props);
                },
                style: {
                    position: 'absolute',
                    zIndex: zIndex
                        ? zIndex
                        : sheetId
                            ? getZIndexFromStack(sheetId, currentContext)
                            : 999,
                    width: '100%',
                    height: '100%',
                },
                pointerEvents: (props === null || props === void 0 ? void 0 : props.backgroundInteractionEnabled)
                    ? 'box-none'
                    : 'auto',
            };
    }, [
        currentContext,
        isModal,
        onHardwareBackPress,
        onRequestClose,
        props,
        zIndex,
        sheetId,
    ]);
    var renderRoute = useCallback(function (route) {
        var _a;
        var RouteComponent = route.component;
        return (<Animated.View key={route.name} style={{
                display: route.name !== ((_a = router.currentRoute) === null || _a === void 0 ? void 0 : _a.name) ? 'none' : 'flex',
                opacity: animations.routeOpacity,
            }}>
            <RouterParamsContext.Provider value={route === null || route === void 0 ? void 0 : route.params}>
              <RouteComponent router={router} params={route === null || route === void 0 ? void 0 : route.params} payload={sheetPayload}/>
            </RouterParamsContext.Provider>
          </Animated.View>);
    }, [animations.routeOpacity, router, sheetPayload]);
    var context = {
        ref: panHandlerRef,
        eventManager: internalEventManager,
    };
    return (<>
        {Platform.OS === 'ios' && !safeAreaInsets ? (<SafeAreaView pointerEvents="none" collapsable={false} onLayout={function (event) {
                var height = event.nativeEvent.layout.height;
                if (height !== undefined) {
                    safeAreaPaddings.current.top = height;
                    clearTimeout(rootViewLayoutEventValues.current.timer);
                    rootViewLayoutEventValues.current.timer = setTimeout(function () {
                        internalEventManager.publish(EVENTS_INTERNAL.safeAreaLayout);
                    }, 0);
                }
            }} style={{
                position: 'absolute',
                width: 1,
                height: 0,
                top: 0,
                left: 0,
                backgroundColor: 'transparent',
            }}>
            <View />
          </SafeAreaView>) : null}

        {Platform.OS === 'ios' && !safeAreaInsets ? (<SafeAreaView pointerEvents="none" collapsable={false} onLayout={function (event) {
                var height = event.nativeEvent.layout.height;
                if (height !== undefined) {
                    safeAreaPaddings.current.bottom = height;
                    clearTimeout(rootViewLayoutEventValues.current.timer);
                    rootViewLayoutEventValues.current.timer = setTimeout(function () {
                        internalEventManager.publish(EVENTS_INTERNAL.safeAreaLayout);
                    }, 0);
                }
            }} style={{
                position: 'absolute',
                width: 1,
                height: 1,
                bottom: 0,
                left: 0,
                backgroundColor: 'transparent',
            }}>
            <View />
          </SafeAreaView>) : null}

        {visible ? (<Root {...rootProps}>
            <GestureHandlerRoot isModal={isModal} style={styles.parentContainer}>
              <PanGestureRefContext.Provider value={context}>
                <DraggableNodesContext.Provider value={draggableNodesContext}>
                  <Animated.View onLayout={onRootViewLayout} ref={rootViewContainerRef} pointerEvents={(props === null || props === void 0 ? void 0 : props.backgroundInteractionEnabled) ? 'box-none' : 'auto'} style={[
                styles.parentContainer,
                {
                    opacity: animations.opacity,
                    width: '100%',
                    justifyContent: 'flex-end',
                    transform: [
                        {
                            translateY: animations.keyboardTranslate,
                        },
                    ],
                },
            ]}>
                    {!(props === null || props === void 0 ? void 0 : props.backgroundInteractionEnabled) ? (<TouchableOpacity onPress={onTouch} activeOpacity={defaultOverlayOpacity} testID={(_b = props.testIDs) === null || _b === void 0 ? void 0 : _b.backdrop} style={{
                    height: dimensions.height +
                        (safeAreaPaddings.current.top || 0) +
                        100,
                    width: '100%',
                    position: 'absolute',
                    backgroundColor: overlayColor,
                    opacity: defaultOverlayOpacity,
                }} {...(props.backdropProps ? props.backdropProps : {})}/>) : null}

                    <Animated.View pointerEvents="box-none" style={__assign(__assign({ borderTopRightRadius: ((_c = props.containerStyle) === null || _c === void 0 ? void 0 : _c.borderTopRightRadius) || 10, borderTopLeftRadius: ((_d = props.containerStyle) === null || _d === void 0 ? void 0 : _d.borderTopLeftRadius) || 10, backgroundColor: ((_e = props.containerStyle) === null || _e === void 0 ? void 0 : _e.backgroundColor) || 'white', borderBottomLeftRadius: ((_f = props.containerStyle) === null || _f === void 0 ? void 0 : _f.borderBottomLeftRadius) ||
                    undefined, borderBottomRightRadius: ((_g = props.containerStyle) === null || _g === void 0 ? void 0 : _g.borderBottomRightRadius) ||
                    undefined, borderRadius: ((_h = props.containerStyle) === null || _h === void 0 ? void 0 : _h.borderRadius) || undefined, width: ((_j = props.containerStyle) === null || _j === void 0 ? void 0 : _j.width) || '100%' }, getElevation(typeof elevation === 'number' ? elevation : 5)), { flex: undefined, height: dimensions.height, maxHeight: dimensions.height, paddingBottom: keyboard.keyboardShown
                    ? keyboard.keyboardHeight || 0
                    : safeAreaPaddings.current.bottom, 
                //zIndex: 10,
                transform: [
                    {
                        translateY: animations.translateY,
                    },
                ] })}>
                      {dimensions.height === 0 ? null : (<PanGestureHandler {...panHandlers} ref={panHandlerRef}>
                          <Animated.View {...handlers.panHandlers} onLayout={onSheetLayout} ref={panViewRef} testID={(_k = props.testIDs) === null || _k === void 0 ? void 0 : _k.sheet} style={[
                    styles.container,
                    {
                        borderTopRightRadius: 10,
                        borderTopLeftRadius: 10,
                    },
                    props.containerStyle,
                    {
                        maxHeight: keyboard.keyboardShown
                            ? dimensions.height - keyboard.keyboardHeight
                            : dimensions.height,
                        marginTop: keyboard.keyboardShown ? 0.5 : 0,
                    },
                ]}>
                            {drawUnderStatusBar ? (<Animated.View style={{
                        height: 100,
                        position: 'absolute',
                        top: -50,
                        backgroundColor: ((_l = props.containerStyle) === null || _l === void 0 ? void 0 : _l.backgroundColor) ||
                            'white',
                        width: '100%',
                        borderTopRightRadius: ((_m = props.containerStyle) === null || _m === void 0 ? void 0 : _m.borderRadius) || 10,
                        borderTopLeftRadius: ((_o = props.containerStyle) === null || _o === void 0 ? void 0 : _o.borderRadius) || 10,
                        transform: [
                            {
                                translateY: animations.underlayTranslateY,
                            },
                        ],
                    }}/>) : null}
                            {gestureEnabled || props.headerAlwaysVisible ? (props.CustomHeaderComponent ? (props.CustomHeaderComponent) : (<Animated.View style={[
                        styles.indicator,
                        props.indicatorStyle,
                    ]}/>)) : null}

                            <View style={{
                    flexShrink: 1,
                }}>
                              {(router === null || router === void 0 ? void 0 : router.hasRoutes()) ? (<RouterContext.Provider value={router}>
                                  {router === null || router === void 0 ? void 0 : router.stack.map(renderRoute)}
                                </RouterContext.Provider>) : (props === null || props === void 0 ? void 0 : props.children)}
                            </View>
                          </Animated.View>
                        </PanGestureHandler>)}

                      {overdrawEnabled ? (<Animated.View style={{
                    position: 'absolute',
                    height: overdrawSize,
                    bottom: -overdrawSize,
                    backgroundColor: ((_p = props.containerStyle) === null || _p === void 0 ? void 0 : _p.backgroundColor) || 'white',
                    width: ((_q = props.containerStyle) === null || _q === void 0 ? void 0 : _q.width) || dimensions.width,
                }}/>) : null}
                    </Animated.View>

                    {ExtraOverlayComponent}
                    {props.withNestedSheetProvider}
                    {sheetId ? (<SheetProvider context={"$$-auto-".concat(sheetId, "-").concat(currentContext, "-provider")}/>) : null}
                  </Animated.View>
                </DraggableNodesContext.Provider>
              </PanGestureRefContext.Provider>
            </GestureHandlerRoot>
          </Root>) : null}
      </>);
});
var GestureHandlerRoot = function (props) {
    return props.isModal ? (<GestureHandlerRootView style={props.style}>
      {props.children}
    </GestureHandlerRootView>) : (<>{props.children}</>);
};
