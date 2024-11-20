"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuItem = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
function MenuItem({ children, disabled = false, disabledTextColor = '#bdbdbd', onPress, pressColor = '#e0e0e0', style, textStyle, ...props }) {
    return (react_1.default.createElement(react_native_1.Pressable, { disabled: disabled, style: ({ pressed }) => ({
            backgroundColor: react_native_1.Platform.OS !== 'android' && pressed ? pressColor : undefined,
        }), android_ripple: { color: pressColor }, onPress: onPress, ...props },
        react_1.default.createElement(react_native_1.View, { style: [styles.container, style] },
            react_1.default.createElement(react_native_1.Text, { numberOfLines: 1, style: [styles.title, disabled && { color: disabledTextColor }, textStyle] }, children))));
}
exports.MenuItem = MenuItem;
const styles = react_native_1.StyleSheet.create({
    container: {
        height: 48,
        justifyContent: 'center',
        maxWidth: 248,
        minWidth: 124,
    },
    title: {
        fontSize: 14,
        fontWeight: '400',
        paddingHorizontal: 16,
        textAlign: 'left',
    },
});
//# sourceMappingURL=MenuItem.js.map