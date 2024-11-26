import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { useDraggableNodesContext, usePanGestureContext, } from '../context';
export var ScrollState = {
    END: -1,
};
var InitialLayoutRect = {
    w: 0,
    h: 0,
    x: 0,
    y: 0,
    px: 0,
    py: 0,
};
export function resolveScrollRef(ref) {
    var _a, _b, _c, _d, _e, _f;
    // FlatList
    if ((_a = ref.current) === null || _a === void 0 ? void 0 : _a._listRef) {
        return (_b = ref.current._listRef) === null || _b === void 0 ? void 0 : _b._scrollRef;
    }
    // FlashList
    if ((_c = ref.current) === null || _c === void 0 ? void 0 : _c.rlvRef) {
        return (_f = (_e = (_d = ref.current) === null || _d === void 0 ? void 0 : _d.rlvRef) === null || _e === void 0 ? void 0 : _e._scrollComponent) === null || _f === void 0 ? void 0 : _f._scrollViewRef;
    }
    // ScrollView
    return ref.current;
}
export function useDraggable(options) {
    var gestureContext = usePanGestureContext();
    var draggableNodes = useDraggableNodesContext();
    var nodeRef = useRef(null);
    var offset = useRef({ x: 0, y: 0 });
    var layout = useRef(InitialLayoutRect);
    useEffect(function () {
        var pushNode = function () {
            var _a, _b;
            var index = (_a = draggableNodes.nodes.current) === null || _a === void 0 ? void 0 : _a.findIndex(function (node) { return node.ref === nodeRef; });
            if (index === undefined || index === -1) {
                (_b = draggableNodes.nodes.current) === null || _b === void 0 ? void 0 : _b.push({
                    ref: nodeRef,
                    offset: offset,
                    rect: layout,
                    handlerConfig: options,
                });
            }
        };
        var popNode = function () {
            var _a, _b;
            var index = (_a = draggableNodes.nodes.current) === null || _a === void 0 ? void 0 : _a.findIndex(function (node) { return node.ref === nodeRef; });
            if (index === undefined || index > -1) {
                (_b = draggableNodes.nodes.current) === null || _b === void 0 ? void 0 : _b.splice(index, 1);
            }
        };
        pushNode();
        return function () {
            popNode();
        };
    }, [draggableNodes.nodes, options]);
    return {
        nodeRef: nodeRef,
        offset: offset,
        draggableNodes: draggableNodes,
        layout: layout,
        gestureContext: gestureContext,
    };
}
/**
 * Create a custom scrollable view inside the action sheet.
 * The scrollable view must implement `onScroll`, and `onLayout` props.
 * @example
 * ```tsx
  const handlers = useScrollHandlers<RNScrollView>();
  return <NativeViewGestureHandler
    simultaneousHandlers={handlers.simultaneousHandlers}
  >
  <ScrollableView
    {...handlers}
  >
  </ScrollableView>
  
  </NativeViewGestureHandler>
 * ```
 */
export function useScrollHandlers(options) {
    var _a = useState(false), _render = _a[0], setRender = _a[1];
    var _b = useDraggable(options), nodeRef = _b.nodeRef, gestureContext = _b.gestureContext, offset = _b.offset, layout = _b.layout;
    var timer = useRef();
    var subscription = useRef();
    var onMeasure = useCallback(function (x, y, w, h, px, py) {
        layout.current = {
            x: x,
            y: y,
            w: w,
            h: h + 10,
            px: px,
            py: py,
        };
    }, [layout]);
    var measureAndLayout = React.useCallback(function () {
        clearTimeout(timer.current);
        timer.current = setTimeout(function () {
            var _a;
            var ref = resolveScrollRef(nodeRef);
            if (Platform.OS == 'web') {
                var rect = ref.getBoundingClientRect();
                ref.style.overflow = "auto";
                onMeasure(rect.x, rect.y, rect.width, rect.height, rect.left, rect.top);
            }
            else {
                (_a = ref === null || ref === void 0 ? void 0 : ref.measure) === null || _a === void 0 ? void 0 : _a.call(ref, onMeasure);
            }
        }, 300);
    }, [nodeRef, onMeasure]);
    useEffect(function () {
        if (Platform.OS === 'web' || !gestureContext.ref)
            return;
        var interval = setInterval(function () {
            // Trigger a rerender when gestureContext gets populated.
            if (gestureContext.ref.current) {
                clearInterval(interval);
                setRender(true);
            }
        }, 10);
    }, [gestureContext.ref]);
    var memoizedProps = React.useMemo(function () {
        return {
            ref: nodeRef,
            simultaneousHandlers: gestureContext.ref,
            onScroll: function (event) {
                var _a = event.nativeEvent.contentOffset, x = _a.x, y = _a.y;
                var maxOffsetX = event.nativeEvent.contentSize.width - layout.current.w;
                var maxOffsetY = event.nativeEvent.contentSize.height - layout.current.h;
                offset.current = {
                    x: x === maxOffsetX || x > maxOffsetX - 5 ? ScrollState.END : x,
                    y: y === maxOffsetY || y > maxOffsetY - 5 ? ScrollState.END : y,
                };
            },
            scrollEventThrottle: 1,
            onLayout: function () {
                var _a;
                measureAndLayout();
                (_a = subscription.current) === null || _a === void 0 ? void 0 : _a.unsubscribe();
                subscription.current = gestureContext.eventManager.subscribe('onoffsetchange', function () {
                    measureAndLayout();
                });
            },
        };
    }, [
        gestureContext.eventManager,
        gestureContext.ref,
        layout,
        measureAndLayout,
        nodeRef,
        offset,
    ]);
    return memoizedProps;
}
