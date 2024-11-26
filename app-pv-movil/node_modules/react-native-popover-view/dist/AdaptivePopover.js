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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
import { Dimensions, Keyboard } from 'react-native';
import { DEBUG, isIOS } from './Constants';
import { Rect } from './Types';
import { getChangedProps, getRectForRef } from './Utility';
import BasePopover from './BasePopover';
var AdaptivePopover = /** @class */ (function (_super) {
    __extends(AdaptivePopover, _super);
    function AdaptivePopover(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            fromRect: null,
            shiftedDisplayArea: null,
            defaultDisplayArea: null,
            displayAreaOffset: null,
            showing: false
        };
        /*
         * This is used so that when the device is rotating
         * or the viewport is expanding for any other reason,
         * we can suspend updates due to content changes until
         * we are finished calculating the new display
         * area and rect for the new viewport size.
         * This makes the recalc on rotation much faster.
         */
        _this.waitForResizeToFinish = false;
        _this.skipNextDefaultDisplayArea = false;
        _this._isMounted = false;
        _this.keyboardDidHideSubscription = null;
        _this.keyboardDidShowSubscription = null;
        _this.handleResizeEventSubscription = null;
        _this.handleResizeEvent = _this.handleResizeEvent.bind(_this);
        _this.keyboardDidHide = _this.keyboardDidHide.bind(_this);
        _this.keyboardDidShow = _this.keyboardDidShow.bind(_this);
        return _this;
    }
    AdaptivePopover.prototype.getUnshiftedDisplayArea = function () {
        return this.props.displayArea ||
            this.state.defaultDisplayArea ||
            new Rect(0, 0, Dimensions.get('window').width, Dimensions.get('window').height);
    };
    // Apply insets and shifts if needed
    AdaptivePopover.prototype.getDisplayArea = function () {
        var _a, _b, _c, _d, _e, _f;
        var displayAreaInsets = this.props.displayAreaInsets;
        var displayArea = this.state.shiftedDisplayArea || this.getUnshiftedDisplayArea();
        if (displayAreaInsets) {
            this.debug('[AdaptivePopover] getDisplayArea - displayAreaInsets', displayAreaInsets);
            return new Rect(displayArea.x + ((_a = displayAreaInsets.left) !== null && _a !== void 0 ? _a : 0), displayArea.y + ((_b = displayAreaInsets.top) !== null && _b !== void 0 ? _b : 0), displayArea.width - ((_c = displayAreaInsets.left) !== null && _c !== void 0 ? _c : 0) - ((_d = displayAreaInsets.right) !== null && _d !== void 0 ? _d : 0), displayArea.height - ((_e = displayAreaInsets.top) !== null && _e !== void 0 ? _e : 0) - ((_f = displayAreaInsets.bottom) !== null && _f !== void 0 ? _f : 0));
        }
        return displayArea;
    };
    AdaptivePopover.prototype.componentDidMount = function () {
        this.handleResizeEventSubscription = Dimensions.addEventListener('change', this.handleResizeEvent);
        if (this.props.fromRect)
            this.setState({ fromRect: this.props.fromRect });
        else if (this.props.fromRef)
            this.calculateRectFromRef();
        this._isMounted = true;
    };
    AdaptivePopover.prototype.componentWillUnmount = function () {
        var _a, _b, _c, _d;
        this._isMounted = false;
        if (typeof ((_a = this.handleResizeEventSubscription) === null || _a === void 0 ? void 0 : _a.remove) === 'function')
            (_b = this.handleResizeEventSubscription) === null || _b === void 0 ? void 0 : _b.remove();
        else
            // Backward-compatibility with RN <= 0.63
            Dimensions.removeEventListener('change', this.handleResizeEvent);
        (_c = this.keyboardDidShowSubscription) === null || _c === void 0 ? void 0 : _c.remove();
        (_d = this.keyboardDidHideSubscription) === null || _d === void 0 ? void 0 : _d.remove();
    };
    AdaptivePopover.prototype.componentDidUpdate = function (prevProps) {
        // Make sure a value we care about has actually changed
        var importantProps = ['fromRef', 'fromRect', 'displayArea'];
        var changedProps = getChangedProps(this.props, prevProps, importantProps);
        if (!changedProps.length)
            return;
        this.debug('[AdaptivePopover] componentDidUpdate - changedProps', changedProps);
        if (changedProps.includes('fromRect')) {
            this.debug('componentDidUpdate - fromRect changed', this.props.fromRect);
            this.setState({ fromRect: this.props.fromRect || null });
        }
        else if (this.props.fromRef !== prevProps.fromRef) {
            this.debug('componentDidUpdate - fromRef changed');
            if (this.props.fromRef)
                this.calculateRectFromRef();
            else
                this.setState({ fromRect: null });
        }
        if (this.props.isVisible && prevProps.isVisible) {
            if (changedProps.includes('displayArea') ||
                (this.displayAreaStore &&
                    !this.getDisplayArea().equals(this.displayAreaStore))) {
                this.debug('componentDidUpdate - displayArea changed', this.getDisplayArea());
                this.displayAreaStore = this.getDisplayArea();
            }
        }
    };
    // First thing called when device rotates
    AdaptivePopover.prototype.handleResizeEvent = function (change) {
        this.debug('handleResizeEvent - New Dimensions', change);
        if (this.props.isVisible) {
            this.waitForResizeToFinish = true;
        }
    };
    AdaptivePopover.prototype.debug = function (line, obj) {
        if (DEBUG || this.props.debug)
            console.log("[" + (new Date()).toISOString() + "] " + line + (obj ? ": " + JSON.stringify(obj) : ''));
    };
    AdaptivePopover.prototype.setDefaultDisplayArea = function (newDisplayArea) {
        return __awaiter(this, void 0, void 0, function () {
            var defaultDisplayArea, isValidDisplayArea, displayAreaOffset_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._isMounted)
                            return [2 /*return*/];
                        defaultDisplayArea = this.state.defaultDisplayArea;
                        isValidDisplayArea = newDisplayArea.width > 0 && newDisplayArea.height > 0;
                        if (!((!defaultDisplayArea || !newDisplayArea.equals(defaultDisplayArea)) &&
                            isValidDisplayArea)) return [3 /*break*/, 6];
                        this.debug('setDefaultDisplayArea - newDisplayArea', newDisplayArea);
                        if (!!this.skipNextDefaultDisplayArea) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.props.getDisplayAreaOffset()];
                    case 1:
                        displayAreaOffset_1 = _a.sent();
                        this.debug('setDefaultDisplayArea - displayAreaOffset', displayAreaOffset_1);
                        return [4 /*yield*/, new Promise(function (resolve) {
                                _this.setState({ defaultDisplayArea: newDisplayArea, displayAreaOffset: displayAreaOffset_1 }, function () { return resolve(null); });
                            })];
                    case 2:
                        _a.sent();
                        if (!this.props.fromRef) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.calculateRectFromRef()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        this.waitForResizeToFinish = false;
                        this.displayAreaStore = this.getDisplayArea();
                        _a.label = 5;
                    case 5:
                        if (this.skipNextDefaultDisplayArea)
                            this.debug('setDefaultDisplayArea - Skipping first because isLandscape');
                        this.skipNextDefaultDisplayArea = false;
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // Custom type here, as KeyboardEvent type does not contain endCoordinates
    AdaptivePopover.prototype.keyboardDidShow = function (e) {
        this.debug("keyboardDidShow - keyboard height: " + e.endCoordinates.height);
        this.shiftForKeyboard(e.endCoordinates.height);
    };
    AdaptivePopover.prototype.keyboardDidHide = function () {
        this.debug('keyboardDidHide');
        if (this._isMounted)
            this.setState({ shiftedDisplayArea: null });
    };
    AdaptivePopover.prototype.shiftForKeyboard = function (keyboardHeight) {
        var displayArea = this.getUnshiftedDisplayArea();
        var absoluteVerticalCutoff = Dimensions.get('window').height - keyboardHeight - (isIOS ? 10 : 40);
        var combinedY = Math.min(displayArea.height + displayArea.y, absoluteVerticalCutoff);
        this.setState({
            shiftedDisplayArea: new Rect(displayArea.x, displayArea.y, displayArea.width, combinedY - displayArea.y)
        });
    };
    AdaptivePopover.prototype.calculateRectFromRef = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var fromRef, initialRect, displayAreaOffset, count, verticalOffset, horizontalOffset, rect;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        fromRef = this.props.fromRef;
                        initialRect = this.state.fromRect || new Rect(0, 0, 0, 0);
                        displayAreaOffset = (_a = this.state.displayAreaOffset) !== null && _a !== void 0 ? _a : { x: 0, y: 0 };
                        this.debug('calculateRectFromRef - waiting for ref');
                        count = 0;
                        _c.label = 1;
                    case 1:
                        if (!!(fromRef === null || fromRef === void 0 ? void 0 : fromRef.current)) return [3 /*break*/, 3];
                        return [4 /*yield*/, new Promise(function (resolve) {
                                setTimeout(resolve, 100);
                            })];
                    case 2:
                        _c.sent();
                        // Timeout after 2 seconds
                        if (count++ > 20)
                            return [2 /*return*/];
                        return [3 /*break*/, 1];
                    case 3:
                        verticalOffset = ((_b = this.props.verticalOffset) !== null && _b !== void 0 ? _b : 0) - displayAreaOffset.y;
                        horizontalOffset = -displayAreaOffset.x;
                        this.debug('calculateRectFromRef - waiting for ref to move from', initialRect);
                        count = 0;
                        _c.label = 4;
                    case 4: return [4 /*yield*/, getRectForRef(fromRef)];
                    case 5:
                        rect = _c.sent();
                        if ([rect.x, rect.y, rect.width, rect.height].every(function (i) { return i === undefined; })) {
                            this.debug('calculateRectFromRef - rect not found, all properties undefined');
                            return [2 /*return*/];
                        }
                        rect = new Rect(rect.x + horizontalOffset, rect.y + verticalOffset, rect.width, rect.height);
                        if (count === 0 && AdaptivePopover.hasRetrievedSatisfyingRect(rect, initialRect)) {
                            return [3 /*break*/, 8];
                        }
                        return [4 /*yield*/, new Promise(function (resolve) {
                                setTimeout(resolve, 100);
                            })];
                    case 6:
                        _c.sent();
                        // Timeout after 2 seconds
                        if (count++ > 20)
                            return [2 /*return*/];
                        _c.label = 7;
                    case 7:
                        if (!AdaptivePopover.hasRetrievedSatisfyingRect(rect, initialRect)) return [3 /*break*/, 4];
                        _c.label = 8;
                    case 8:
                        this.debug('calculateRectFromRef - calculated Rect', rect);
                        if (this._isMounted)
                            this.setState({ fromRect: rect });
                        return [2 /*return*/];
                }
            });
        });
    };
    AdaptivePopover.prototype.render = function () {
        var _this = this;
        var _a = this.props, onOpenStart = _a.onOpenStart, onCloseStart = _a.onCloseStart, onCloseComplete = _a.onCloseComplete, fromRef = _a.fromRef, otherProps = __rest(_a, ["onOpenStart", "onCloseStart", "onCloseComplete", "fromRef"]);
        var _b = this.state, fromRect = _b.fromRect, showing = _b.showing;
        // Don't render popover until we have an initial fromRect calculated for the view
        if (fromRef && !fromRect && !showing)
            return null;
        return (React.createElement(BasePopover, __assign({}, otherProps, { displayArea: this.getDisplayArea(), fromRect: fromRect, onOpenStart: function () {
                onOpenStart === null || onOpenStart === void 0 ? void 0 : onOpenStart();
                _this.debug('Setting up keyboard listeners');
                _this.keyboardDidShowSubscription = Keyboard.addListener('keyboardDidShow', _this.keyboardDidShow);
                _this.keyboardDidHideSubscription = Keyboard.addListener('keyboardDidHide', _this.keyboardDidHide);
                _this.displayAreaStore = _this.getDisplayArea();
                _this.setState({ showing: true });
            }, onCloseStart: function () {
                onCloseStart === null || onCloseStart === void 0 ? void 0 : onCloseStart();
                _this.debug('Tearing down keyboard listeners');
                if (_this.keyboardDidShowSubscription !== null) {
                    _this.keyboardDidShowSubscription.remove();
                    _this.keyboardDidShowSubscription = null;
                }
                if (_this.keyboardDidHideSubscription !== null) {
                    _this.keyboardDidHideSubscription.remove();
                    _this.keyboardDidHideSubscription = null;
                }
                if (_this._isMounted)
                    _this.setState({ shiftedDisplayArea: null });
            }, onCloseComplete: function () {
                _this.setState({ showing: false }, function () {
                    onCloseComplete === null || onCloseComplete === void 0 ? void 0 : onCloseComplete();
                });
            }, skipMeasureContent: function () { return _this.waitForResizeToFinish; }, onDisplayAreaChanged: function (rect) { return _this.setDefaultDisplayArea(rect); } })));
    };
    AdaptivePopover.hasRetrievedSatisfyingRect = function (rect, initialRect) {
        /*
         * Checking if x and y is less than -1000 because of a strange issue on Android related
         * to the "Toggle from" feature, where the rect.y is a large negative number at first
         */
        return !(rect.equals(initialRect) || rect.y < -1000 || rect.x < -1000);
    };
    return AdaptivePopover;
}(Component));
export default AdaptivePopover;
//# sourceMappingURL=AdaptivePopover.js.map