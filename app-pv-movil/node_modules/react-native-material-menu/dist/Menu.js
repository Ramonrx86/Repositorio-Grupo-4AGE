"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Menu = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
var States;
(function (States) {
    States[States["Hidden"] = 0] = "Hidden";
    States[States["Animating"] = 1] = "Animating";
    States[States["Shown"] = 2] = "Shown";
})(States || (States = {}));
const EASING = react_native_1.Easing.bezier(0.4, 0, 0.2, 1);
const SCREEN_INDENT = 8;
class Menu extends react_1.default.Component {
    _container = null;
    static defaultProps = {
        animationDuration: 300,
    };
    constructor(props) {
        super(props);
        this.state = {
            menuState: States.Hidden,
            top: 0,
            left: 0,
            menuWidth: 0,
            menuHeight: 0,
            buttonWidth: 0,
            buttonHeight: 0,
            menuSizeAnimation: new react_native_1.Animated.ValueXY({ x: 0, y: 0 }),
            opacityAnimation: new react_native_1.Animated.Value(0),
        };
    }
    componentDidMount() {
        if (!this.props.visible) {
            return;
        }
        this.show();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.visible === this.props.visible) {
            return;
        }
        if (this.props.visible) {
            this.show();
        }
        else {
            this.hide();
        }
    }
    setContainerRef = (ref) => {
        this._container = ref;
    };
    // Start menu animation
    onMenuLayout = (e) => {
        if (this.state.menuState === States.Animating) {
            return;
        }
        const { width, height } = e.nativeEvent.layout;
        this.setState({
            menuState: States.Animating,
            menuWidth: width,
            menuHeight: height,
        }, () => {
            react_native_1.Animated.parallel([
                react_native_1.Animated.timing(this.state.menuSizeAnimation, {
                    toValue: { x: width, y: height },
                    duration: this.props.animationDuration,
                    easing: EASING,
                    useNativeDriver: false,
                }),
                react_native_1.Animated.timing(this.state.opacityAnimation, {
                    toValue: 1,
                    duration: this.props.animationDuration,
                    easing: EASING,
                    useNativeDriver: false,
                }),
            ]).start();
        });
    };
    show = () => {
        this._container?.measureInWindow((left, top, buttonWidth, buttonHeight) => {
            this.setState({
                buttonHeight,
                buttonWidth,
                left,
                menuState: States.Shown,
                top,
            });
        });
    };
    hide = () => {
        react_native_1.Animated.timing(this.state.opacityAnimation, {
            toValue: 0,
            duration: this.props.animationDuration,
            easing: EASING,
            useNativeDriver: false,
        }).start(() => {
            // Reset state
            this.setState({
                menuState: States.Hidden,
                menuSizeAnimation: new react_native_1.Animated.ValueXY({ x: 0, y: 0 }),
                opacityAnimation: new react_native_1.Animated.Value(0),
            });
        });
    };
    onRequestClose = () => {
        this.props.onRequestClose?.();
    };
    render() {
        const { isRTL } = react_native_1.I18nManager;
        const dimensions = react_native_1.Dimensions.get('window');
        const { width: windowWidth } = dimensions;
        const windowHeight = dimensions.height - (react_native_1.StatusBar.currentHeight || 0);
        const { menuSizeAnimation, menuWidth, menuHeight, buttonWidth, buttonHeight, opacityAnimation, } = this.state;
        const menuSize = {
            width: menuSizeAnimation.x,
            height: menuSizeAnimation.y,
        };
        // Adjust position of menu
        let { left, top } = this.state;
        const transforms = [];
        if ((isRTL && left + buttonWidth - menuWidth > SCREEN_INDENT) ||
            (!isRTL && left + menuWidth > windowWidth - SCREEN_INDENT)) {
            transforms.push({
                translateX: react_native_1.Animated.multiply(menuSizeAnimation.x, -1),
            });
            left = Math.min(windowWidth - SCREEN_INDENT, left + buttonWidth);
        }
        else if (left < SCREEN_INDENT) {
            left = SCREEN_INDENT;
        }
        // Flip by Y axis if menu hits bottom screen border
        if (top > windowHeight - menuHeight - SCREEN_INDENT) {
            transforms.push({
                translateY: react_native_1.Animated.multiply(menuSizeAnimation.y, -1),
            });
            top = windowHeight - SCREEN_INDENT;
            top = Math.min(windowHeight - SCREEN_INDENT, top + buttonHeight);
        }
        else if (top < SCREEN_INDENT) {
            top = SCREEN_INDENT;
        }
        const shadowMenuContainerStyle = {
            opacity: opacityAnimation,
            transform: transforms,
            top,
            // Switch left to right for rtl devices
            ...(isRTL ? { right: left } : { left }),
        };
        const { menuState } = this.state;
        const animationStarted = menuState === States.Animating;
        const modalVisible = menuState === States.Shown || animationStarted;
        const { testID, anchor, style, children } = this.props;
        return (react_1.default.createElement(react_native_1.View, { ref: this.setContainerRef, collapsable: false, testID: testID },
            anchor,
            react_1.default.createElement(react_native_1.Modal, { visible: modalVisible, onRequestClose: this.onRequestClose, supportedOrientations: [
                    'portrait',
                    'portrait-upside-down',
                    'landscape',
                    'landscape-left',
                    'landscape-right',
                ], transparent: true },
                react_1.default.createElement(react_native_1.TouchableWithoutFeedback, { onPress: this.onRequestClose, accessible: false },
                    react_1.default.createElement(react_native_1.View, { style: react_native_1.StyleSheet.absoluteFill },
                        react_1.default.createElement(react_native_1.Animated.View, { onLayout: this.onMenuLayout, style: [styles.shadowMenuContainer, shadowMenuContainerStyle, style] },
                            react_1.default.createElement(react_native_1.Animated.View, { style: [styles.menuContainer, animationStarted && menuSize] }, children)))))));
    }
}
exports.Menu = Menu;
const styles = react_native_1.StyleSheet.create({
    shadowMenuContainer: {
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 4,
        opacity: 0,
        // Shadow
        ...react_native_1.Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.14,
                shadowRadius: 2,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    menuContainer: {
        overflow: 'hidden',
    },
});
//# sourceMappingURL=Menu.js.map