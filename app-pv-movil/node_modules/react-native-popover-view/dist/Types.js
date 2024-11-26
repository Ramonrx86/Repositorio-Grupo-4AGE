// eslint-disable-next-line
export var Placement;
(function (Placement) {
    Placement["TOP"] = "top";
    Placement["RIGHT"] = "right";
    Placement["BOTTOM"] = "bottom";
    Placement["LEFT"] = "left";
    Placement["AUTO"] = "auto";
    Placement["FLOATING"] = "floating";
    // deprecated
    Placement["CENTER"] = "center";
})(Placement || (Placement = {}));
// eslint-disable-next-line
export var Mode;
(function (Mode) {
    Mode["JS_MODAL"] = "js-modal";
    Mode["RN_MODAL"] = "rn-modal";
    Mode["TOOLTIP"] = "tooltip";
})(Mode || (Mode = {}));
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.equals = function (b) {
        return Math.round(this.x) === Math.round(b.x) && Math.round(this.y) === Math.round(b.y);
    };
    return Point;
}());
export { Point };
var Size = /** @class */ (function () {
    function Size(width, height) {
        this.width = width;
        this.height = height;
    }
    Size.prototype.equals = function (b) {
        return Math.round(this.width) === Math.round(b.width) &&
            Math.round(this.height) === Math.round(b.height);
    };
    return Size;
}());
export { Size };
var Rect = /** @class */ (function () {
    function Rect(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    Rect.prototype.equals = function (b) {
        return (Math.round(this.x) === Math.round(b.x) &&
            Math.round(this.y) === Math.round(b.y) &&
            Math.round(this.width) === Math.round(b.width) &&
            Math.round(this.height) === Math.round(b.height));
    };
    Rect.clone = function (rect) {
        return new Rect(rect.x, rect.y, rect.width, rect.height);
    };
    return Rect;
}());
export { Rect };
//# sourceMappingURL=Types.js.map