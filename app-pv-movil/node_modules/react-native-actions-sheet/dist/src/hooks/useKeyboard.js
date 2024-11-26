import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, Platform, } from 'react-native';
var emptyCoordinates = Object.freeze({
    screenX: 0,
    screenY: 0,
    width: 0,
    height: 0,
});
var initialValue = {
    start: emptyCoordinates,
    end: emptyCoordinates,
};
export function useKeyboard(enabled) {
    var pauseKeyboardHandler = useRef(false);
    var _a = useState(false), shown = _a[0], setShown = _a[1];
    var _b = useState(initialValue), coordinates = _b[0], setCoordinates = _b[1];
    var _c = useState(0), keyboardHeight = _c[0], setKeyboardHeight = _c[1];
    var handleKeyboardDidShow = React.useCallback(function (e) {
        if (pauseKeyboardHandler.current)
            return;
        setCoordinates({ start: e.startCoordinates, end: e.endCoordinates });
        setKeyboardHeight(e.endCoordinates.height);
        setShown(true);
    }, []);
    var handleKeyboardDidHide = React.useCallback(function (e) {
        setShown(false);
        if (e) {
            setCoordinates({ start: e.startCoordinates, end: e.endCoordinates });
        }
        else {
            setCoordinates(initialValue);
            setKeyboardHeight(0);
        }
    }, []);
    useEffect(function () {
        var subscriptions = [];
        if (enabled) {
            subscriptions = [
                Keyboard.addListener('keyboardDidChangeFrame', handleKeyboardDidShow),
                Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide),
            ];
            if (Platform.OS == 'android') {
                subscriptions.push(Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow));
            }
            else {
                subscriptions.push(Keyboard.addListener('keyboardWillShow', handleKeyboardDidShow), Keyboard.addListener('keyboardWillHide', handleKeyboardDidHide));
            }
        }
        return function () {
            subscriptions.forEach(function (subscription) { return subscription.remove(); });
        };
    }, [enabled, handleKeyboardDidHide, handleKeyboardDidShow]);
    return {
        keyboardShown: !enabled ? false : shown,
        coordinates: !enabled || !shown ? emptyCoordinates : coordinates,
        keyboardHeight: !enabled || !shown ? 0 : keyboardHeight,
        pauseKeyboardHandler: pauseKeyboardHandler,
        reset: function () {
            setShown(false);
            setKeyboardHeight(0);
        },
    };
}
