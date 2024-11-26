/* eslint-disable curly */
import React, { useImperativeHandle } from 'react';
import { Platform, ScrollView as RNScrollView, } from 'react-native';
import { ScrollView as RNGHScrollView, } from 'react-native-gesture-handler';
import { useScrollHandlers } from '../hooks/use-scroll-handlers';
function $ScrollView(props, ref) {
    var handlers = useScrollHandlers({
        hasRefreshControl: !!props.refreshControl,
        refreshControlBoundary: props.refreshControlGestureArea || 0.15,
    });
    useImperativeHandle(ref, function () { return handlers.ref; });
    var ScrollComponent = Platform.OS === 'web' ? RNScrollView : RNGHScrollView;
    return (<ScrollComponent {...props} {...handlers} onScroll={function (event) {
            var _a;
            handlers.onScroll(event);
            (_a = props.onScroll) === null || _a === void 0 ? void 0 : _a.call(props, event);
        }} onLayout={function (event) {
            var _a;
            handlers.onLayout();
            (_a = props.onLayout) === null || _a === void 0 ? void 0 : _a.call(props, event);
        }} bounces={false} scrollEventThrottle={1}/>);
}
export var ScrollView = React.forwardRef($ScrollView);
