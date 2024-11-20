"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuDivider = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
function MenuDivider({ color = 'rgba(0,0,0,0.12)' }) {
    return react_1.default.createElement(react_native_1.View, { style: [styles.divider, { borderBottomColor: color }] });
}
exports.MenuDivider = MenuDivider;
const styles = react_native_1.StyleSheet.create({
    divider: {
        flex: 1,
        borderBottomWidth: react_native_1.StyleSheet.hairlineWidth,
    },
});
//# sourceMappingURL=MenuDivider.js.map