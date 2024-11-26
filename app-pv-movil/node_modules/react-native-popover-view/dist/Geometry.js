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
import { Rect, Size, Point, Placement } from './Types';
import { getBorderRadius } from './Utility';
import { POPOVER_MARGIN } from './Constants';
var Geometry = /** @class */ (function () {
    function Geometry(_a) {
        var popoverOrigin = _a.popoverOrigin, anchorPoint = _a.anchorPoint, placement = _a.placement, forcedContentSize = _a.forcedContentSize, viewLargerThanDisplayArea = _a.viewLargerThanDisplayArea;
        this.popoverOrigin = popoverOrigin;
        this.anchorPoint = anchorPoint;
        this.placement = placement;
        this.forcedContentSize = forcedContentSize;
        this.viewLargerThanDisplayArea = viewLargerThanDisplayArea;
    }
    Geometry.equals = function (a, b) {
        var _a, _b, _c, _d;
        return a.popoverOrigin.equals(b.popoverOrigin) &&
            a.anchorPoint.equals(b.anchorPoint) &&
            a.placement === b.placement &&
            a.forcedContentSize.equals(b.forcedContentSize) &&
            ((_a = a.viewLargerThanDisplayArea) === null || _a === void 0 ? void 0 : _a.width) === ((_b = b.viewLargerThanDisplayArea) === null || _b === void 0 ? void 0 : _b.width) &&
            ((_c = a.viewLargerThanDisplayArea) === null || _c === void 0 ? void 0 : _c.height) === ((_d = b.viewLargerThanDisplayArea) === null || _d === void 0 ? void 0 : _d.height);
    };
    return Geometry;
}());
export { Geometry };
export function computeGeometry(options) {
    var requestedContentSize = options.requestedContentSize, placement = options.placement, displayArea = options.displayArea, debug = options.debug, popoverStyle = options.popoverStyle, arrowShift = options.arrowShift, popoverShift = options.popoverShift, arrowSize = options.arrowSize;
    var newGeom = null;
    // Make copy so doesn't modify original
    var fromRect = options.fromRect
        ? Rect.clone(options.fromRect)
        : null;
    if (fromRect && options.fromRect instanceof Rect) {
        var borderRadius = getBorderRadius(popoverStyle);
        // Default to first option if given list of placements
        var selectedPlacement = Array.isArray(placement) ? placement[0] : placement;
        // If we can find a placement in the list that is better, use that
        if (Array.isArray(placement)) {
            var spaceList = generateSpaceList({ fromRect: fromRect, displayArea: displayArea, requestedContentSize: requestedContentSize, arrowSize: arrowSize });
            var bestPlacements_1 = calculateBestPlacements(spaceList);
            var bestProvidedPlacement = placement.
                filter(function (p) { return p === Placement.AUTO || p === Placement.FLOATING || bestPlacements_1.includes(p); })[0];
            if (bestProvidedPlacement)
                selectedPlacement = bestProvidedPlacement;
        }
        switch (selectedPlacement) {
            case Placement.TOP:
                newGeom = computeTopGeometry(__assign(__assign({}, options), { fromRect: fromRect, borderRadius: borderRadius }));
                break;
            case Placement.BOTTOM:
                newGeom = computeBottomGeometry(__assign(__assign({}, options), { fromRect: fromRect, borderRadius: borderRadius }));
                break;
            case Placement.LEFT:
                newGeom = computeLeftGeometry(__assign(__assign({}, options), { fromRect: fromRect, borderRadius: borderRadius }));
                break;
            case Placement.RIGHT:
                newGeom = computeRightGeometry(__assign(__assign({}, options), { fromRect: fromRect, borderRadius: borderRadius }));
                break;
            case Placement.FLOATING:
                newGeom = null;
                break;
            default:
                newGeom = computeAutoGeometry(__assign(__assign({}, options), { fromRect: fromRect, borderRadius: borderRadius }));
        }
        debug('computeGeometry - initial chosen geometry', newGeom);
        /*
         * If the popover will be restricted and the view that the popover is showing
         * from is sufficiently large, try to show the popover inside the view
         */
        if (newGeom &&
            (newGeom.viewLargerThanDisplayArea.width || newGeom.viewLargerThanDisplayArea.height)) {
            var fromRectHeightVisible = fromRect.y < displayArea.y
                ? fromRect.height - (displayArea.y - fromRect.y)
                : displayArea.y + displayArea.height - fromRect.y;
            if (fromRect.width > requestedContentSize.width &&
                fromRectHeightVisible > requestedContentSize.height) {
                var preferredX = Math.max(fromRect.x + 10, fromRect.x + ((fromRect.width - requestedContentSize.width) / 2));
                var preferredY = Math.max(fromRect.y + 10, fromRect.y + ((fromRect.height - requestedContentSize.height) / 2));
                var constrainedX = Math.max(preferredX, displayArea.x);
                if (constrainedX + requestedContentSize.width > displayArea.x + displayArea.width)
                    constrainedX = displayArea.x + displayArea.width - requestedContentSize.width;
                var constrainedY = Math.max(preferredY, displayArea.y);
                if (constrainedY + requestedContentSize.height > displayArea.y + displayArea.height)
                    constrainedY = displayArea.y + displayArea.height - requestedContentSize.height;
                var forcedContentSize = new Size(Math.min(fromRect.width - 20, displayArea.width), Math.min(fromRect.height - 20, displayArea.height));
                debug('computeGeometry - showing inside anchor');
                newGeom = new Geometry({
                    popoverOrigin: new Point(constrainedX, constrainedY),
                    anchorPoint: new Point(fromRect.x + (fromRect.width / 2), fromRect.y + (fromRect.height / 2)),
                    placement: Placement.FLOATING,
                    forcedContentSize: forcedContentSize,
                    viewLargerThanDisplayArea: {
                        width: requestedContentSize.width > forcedContentSize.width,
                        height: requestedContentSize.height > forcedContentSize.height
                    }
                });
            }
            else if (
            /*
             * If we can't fit inside or outside the fromRect, show the popover floating on the screen,
             *  but only do this if they haven't asked for a specifc placement type
             *  and if it will actually help show more content
             */
            placement === Placement.AUTO &&
                ((newGeom.viewLargerThanDisplayArea.width &&
                    [Placement.RIGHT, Placement.LEFT].includes(newGeom.placement)) ||
                    (newGeom.viewLargerThanDisplayArea.height &&
                        [Placement.TOP, Placement.BOTTOM].includes(newGeom.placement)))) {
                newGeom = null;
            }
        }
    }
    if (!newGeom) {
        var minY = displayArea.y;
        var minX = displayArea.x;
        var preferedY = ((displayArea.height - requestedContentSize.height) / 2) + displayArea.y;
        var preferedX = ((displayArea.width - requestedContentSize.width) / 2) + displayArea.x;
        debug('computeGeometry - showing floating');
        newGeom = new Geometry({
            popoverOrigin: new Point(Math.max(minX, preferedX), Math.max(minY, preferedY)),
            anchorPoint: new Point((displayArea.width / 2) + displayArea.x, (displayArea.height / 2) + displayArea.y),
            placement: Placement.FLOATING,
            forcedContentSize: new Size(displayArea.width, displayArea.height),
            viewLargerThanDisplayArea: {
                width: preferedX < minX - 1,
                height: preferedY < minY - 1
            }
        });
        // Apply popover shift
        if (!newGeom.viewLargerThanDisplayArea.width && (popoverShift === null || popoverShift === void 0 ? void 0 : popoverShift.x)) {
            debug('computeGeometry - applying popoverShift.x', popoverShift.x);
            var horizontalMargin = (displayArea.width - requestedContentSize.width) / 2;
            newGeom.popoverOrigin.x += popoverShift.x * horizontalMargin;
            newGeom.anchorPoint.x = newGeom.popoverOrigin.x + (requestedContentSize.width / 2);
        }
        if (!newGeom.viewLargerThanDisplayArea.height && (popoverShift === null || popoverShift === void 0 ? void 0 : popoverShift.y)) {
            debug('computeGeometry - applying popoverShift.y', popoverShift.y);
            var verticalMargin = (displayArea.height - requestedContentSize.height) / 2;
            newGeom.popoverOrigin.y += popoverShift.y * verticalMargin;
            newGeom.anchorPoint.y = newGeom.popoverOrigin.y + (requestedContentSize.height / 2);
        }
    }
    if (arrowShift && fromRect) {
        if (newGeom.placement === Placement.BOTTOM || newGeom.placement === Placement.TOP)
            newGeom.anchorPoint.x += arrowShift * 0.5 * fromRect.width;
        else
            newGeom.anchorPoint.y += arrowShift * 0.5 * fromRect.height;
    }
    debug('computeGeometry - final chosen geometry', newGeom);
    return newGeom;
}
function computeTopGeometry(_a) {
    var displayArea = _a.displayArea, fromRect = _a.fromRect, requestedContentSize = _a.requestedContentSize, arrowSize = _a.arrowSize, borderRadius = _a.borderRadius, offset = _a.offset;
    // Apply a margin on non-arrow sides
    displayArea = new Rect(displayArea.x + POPOVER_MARGIN, displayArea.y + POPOVER_MARGIN, displayArea.width - (POPOVER_MARGIN * 2), displayArea.height);
    if (offset)
        fromRect.y -= offset;
    var minY = displayArea.y;
    var maxY = displayArea.y + displayArea.height;
    var preferredY = fromRect.y - requestedContentSize.height - arrowSize.height;
    var forcedContentSize = new Size(displayArea.width, (fromRect.y - arrowSize.height - displayArea.y));
    var viewLargerThanDisplayArea = {
        height: preferredY <= minY - 1,
        width: requestedContentSize.width >= displayArea.width + 1
    };
    var viewWidth = viewLargerThanDisplayArea.width
        ? forcedContentSize.width
        : requestedContentSize.width;
    var maxX = displayArea.x + displayArea.width - viewWidth;
    var minX = displayArea.x;
    var preferredX = fromRect.x + ((fromRect.width - viewWidth) / 2);
    var popoverOrigin = new Point(Math.min(maxX, Math.max(minX, preferredX)), Math.min(maxY, Math.max(minY, preferredY)));
    var anchorPoint = new Point(fromRect.x + (fromRect.width / 2), fromRect.y);
    // Make sure the arrow isn't cut off
    anchorPoint.x = Math.max(anchorPoint.x, popoverOrigin.x + (arrowSize.width / 2) + borderRadius);
    anchorPoint.x = Math.min(anchorPoint.x, displayArea.x + displayArea.width - (arrowSize.width / 2) - borderRadius);
    return new Geometry({
        popoverOrigin: popoverOrigin,
        anchorPoint: anchorPoint,
        placement: Placement.TOP,
        forcedContentSize: forcedContentSize,
        viewLargerThanDisplayArea: viewLargerThanDisplayArea
    });
}
function computeBottomGeometry(_a) {
    var displayArea = _a.displayArea, fromRect = _a.fromRect, requestedContentSize = _a.requestedContentSize, arrowSize = _a.arrowSize, borderRadius = _a.borderRadius, offset = _a.offset;
    // Apply a margin on non-arrow sides
    displayArea = new Rect(displayArea.x + POPOVER_MARGIN, displayArea.y, displayArea.width - (POPOVER_MARGIN * 2), displayArea.height - POPOVER_MARGIN);
    if (offset)
        fromRect.y += offset;
    var minY = displayArea.y;
    var maxY = displayArea.y + displayArea.height;
    var preferedY = fromRect.y + fromRect.height;
    var forcedContentSize = new Size(displayArea.width, displayArea.y + displayArea.height - preferedY);
    var viewLargerThanDisplayArea = {
        height: preferedY + requestedContentSize.height >= displayArea.y + displayArea.height + 1,
        width: requestedContentSize.width >= displayArea.width + 1
    };
    var viewWidth = viewLargerThanDisplayArea.width
        ? forcedContentSize.width
        : requestedContentSize.width;
    var maxX = displayArea.x + displayArea.width - viewWidth;
    var minX = displayArea.x;
    var preferedX = fromRect.x + ((fromRect.width - viewWidth) / 2);
    var popoverOrigin = new Point(Math.min(maxX, Math.max(minX, preferedX)), Math.min(maxY, Math.max(minY, preferedY)));
    var anchorPoint = new Point(fromRect.x + (fromRect.width / 2), fromRect.y + fromRect.height);
    // Make sure the arrow isn't cut off
    anchorPoint.x = Math.max(anchorPoint.x, popoverOrigin.x + (arrowSize.width / 2) + borderRadius);
    anchorPoint.x = Math.min(anchorPoint.x, displayArea.x + displayArea.width - (arrowSize.width / 2) - borderRadius);
    return new Geometry({
        popoverOrigin: popoverOrigin,
        anchorPoint: anchorPoint,
        placement: Placement.BOTTOM,
        forcedContentSize: forcedContentSize,
        viewLargerThanDisplayArea: viewLargerThanDisplayArea
    });
}
function computeLeftGeometry(_a) {
    var displayArea = _a.displayArea, fromRect = _a.fromRect, requestedContentSize = _a.requestedContentSize, borderRadius = _a.borderRadius, arrowSize = _a.arrowSize, offset = _a.offset;
    // Apply a margin on non-arrow sides
    displayArea = new Rect(displayArea.x + POPOVER_MARGIN, displayArea.y + POPOVER_MARGIN, displayArea.width, displayArea.height - (POPOVER_MARGIN * 2));
    if (offset)
        fromRect.x -= offset;
    var forcedContentSize = new Size(fromRect.x - displayArea.x - arrowSize.width, displayArea.height);
    var viewLargerThanDisplayArea = {
        height: requestedContentSize.height >= displayArea.height + 1,
        width: requestedContentSize.width >= fromRect.x - displayArea.x - arrowSize.width + 1
    };
    var viewWidth = viewLargerThanDisplayArea.width
        ? forcedContentSize.width
        : requestedContentSize.width;
    var viewHeight = viewLargerThanDisplayArea.height
        ? forcedContentSize.height
        : requestedContentSize.height;
    var preferedX = fromRect.x - viewWidth - arrowSize.height;
    var minX = displayArea.x;
    var maxX = displayArea.x + displayArea.width;
    var preferedY = fromRect.y + ((fromRect.height - viewHeight) / 2);
    var minY = displayArea.y;
    var maxY = (displayArea.height - viewHeight) + displayArea.y;
    var popoverOrigin = new Point(Math.min(Math.max(minX, preferedX), maxX), Math.min(Math.max(minY, preferedY), maxY));
    var anchorPoint = new Point(fromRect.x, fromRect.y + (fromRect.height / 2));
    // Make sure the arrow isn't cut off
    anchorPoint.y = Math.max(anchorPoint.y, popoverOrigin.y + (arrowSize.height / 2) + borderRadius);
    anchorPoint.y = Math.min(anchorPoint.y, displayArea.y + displayArea.height - (arrowSize.height / 2) - borderRadius);
    return new Geometry({
        popoverOrigin: popoverOrigin,
        anchorPoint: anchorPoint,
        placement: Placement.LEFT,
        forcedContentSize: forcedContentSize,
        viewLargerThanDisplayArea: viewLargerThanDisplayArea
    });
}
function computeRightGeometry(_a) {
    var displayArea = _a.displayArea, fromRect = _a.fromRect, requestedContentSize = _a.requestedContentSize, arrowSize = _a.arrowSize, borderRadius = _a.borderRadius, offset = _a.offset;
    // Apply a margin on non-arrow sides
    displayArea = new Rect(displayArea.x, displayArea.y + POPOVER_MARGIN, displayArea.width - POPOVER_MARGIN, displayArea.height - (POPOVER_MARGIN * 2));
    if (offset)
        fromRect.x += offset;
    var horizontalSpace = displayArea.x + displayArea.width - (fromRect.x + fromRect.width) - arrowSize.width;
    var forcedContentSize = new Size(horizontalSpace, displayArea.height);
    var viewLargerThanDisplayArea = {
        height: requestedContentSize.height >= displayArea.height + 1,
        width: requestedContentSize.width >= horizontalSpace + 1
    };
    var viewHeight = viewLargerThanDisplayArea.height
        ? forcedContentSize.height
        : requestedContentSize.height;
    var preferedX = fromRect.x + fromRect.width;
    var minX = displayArea.x;
    var maxX = displayArea.x + displayArea.width;
    var preferedY = fromRect.y + ((fromRect.height - viewHeight) / 2);
    var minY = displayArea.y;
    var maxY = (displayArea.height - viewHeight) + displayArea.y;
    var popoverOrigin = new Point(Math.min(Math.max(minX, preferedX), maxX), Math.min(Math.max(minY, preferedY), maxY));
    var anchorPoint = new Point(fromRect.x + fromRect.width, fromRect.y + (fromRect.height / 2.0));
    // Make sure the arrow isn't cut off
    anchorPoint.y = Math.max(anchorPoint.y, popoverOrigin.y + (arrowSize.height / 2) + borderRadius);
    anchorPoint.y = Math.min(anchorPoint.y, displayArea.y + displayArea.height - (arrowSize.height / 2) - borderRadius);
    return new Geometry({
        popoverOrigin: popoverOrigin,
        anchorPoint: anchorPoint,
        placement: Placement.RIGHT,
        forcedContentSize: forcedContentSize,
        viewLargerThanDisplayArea: viewLargerThanDisplayArea
    });
}
function generateSpaceList(_a) {
    var _b;
    var fromRect = _a.fromRect, displayArea = _a.displayArea, arrowSize = _a.arrowSize, requestedContentSize = _a.requestedContentSize;
    function generateOption(props) {
        return __assign(__assign({}, props), { fits: props.sizeAvailable >= props.sizeRequested, extraSpace: props.sizeAvailable - props.sizeRequested });
    }
    return _b = {},
        _b[Placement.LEFT] = generateOption({
            sizeAvailable: fromRect.x - displayArea.x - arrowSize.width,
            sizeRequested: requestedContentSize.width
        }),
        _b[Placement.RIGHT] = generateOption({
            sizeAvailable: displayArea.x + displayArea.width - (fromRect.x + fromRect.width) - arrowSize.width,
            sizeRequested: requestedContentSize.width
        }),
        _b[Placement.TOP] = generateOption({
            sizeAvailable: fromRect.y - displayArea.y - arrowSize.width,
            sizeRequested: requestedContentSize.height
        }),
        _b[Placement.BOTTOM] = generateOption({
            sizeAvailable: displayArea.y + displayArea.height - (fromRect.y + fromRect.height) - arrowSize.width,
            sizeRequested: requestedContentSize.height
        }),
        _b;
}
function computeAutoGeometry(options) {
    var displayArea = options.displayArea, requestedContentSize = options.requestedContentSize, fromRect = options.fromRect, previousPlacement = options.previousPlacement, debug = options.debug, arrowSize = options.arrowSize;
    // Keep same placement if possible (left/right)
    if (previousPlacement === Placement.LEFT || previousPlacement === Placement.RIGHT) {
        var geom = previousPlacement === Placement.LEFT
            ? computeLeftGeometry(options)
            : computeRightGeometry(options);
        debug('computeAutoGeometry - Left/right tryping to keep same, geometry', geom);
        if (!geom.viewLargerThanDisplayArea.width)
            return geom;
    }
    // Keep same placement if possible (top/bottom)
    if (previousPlacement === Placement.TOP || previousPlacement === Placement.BOTTOM) {
        var geom = previousPlacement === Placement.TOP
            ? computeTopGeometry(options)
            : computeBottomGeometry(options);
        debug('computeAutoGeometry - Top/bottom tryping to keep same, geometry', geom);
        if (!geom.viewLargerThanDisplayArea.height)
            return geom;
    }
    /*
     * Otherwise, find the place that can fit it best (try left/right but
     * default to top/bottom as that will typically have more space)
     */
    // generating list of all possible sides with validity
    debug('computeAutoGeometry - displayArea', displayArea);
    debug('computeAutoGeometry - fromRect', fromRect);
    var spaceList = generateSpaceList({ fromRect: fromRect, displayArea: displayArea, arrowSize: arrowSize, requestedContentSize: requestedContentSize });
    debug('computeAutoGeometry - List of available space', spaceList);
    var bestPlacementPosition = calculateBestPlacements(spaceList)[0];
    debug('computeAutoGeometry - Found best postition for placement', bestPlacementPosition);
    switch (bestPlacementPosition) {
        case Placement.LEFT: return computeLeftGeometry(options);
        case Placement.RIGHT: return computeRightGeometry(options);
        case Placement.BOTTOM: return computeBottomGeometry(options);
        case Placement.TOP: return computeTopGeometry(options);
        // Return nothing so popover will be placed in middle of screen
        default: return null;
    }
}
function calculateBestPlacements(spaceList) {
    return Object.keys(spaceList).filter(function (o) { var _a; return (_a = spaceList[o]) === null || _a === void 0 ? void 0 : _a.fits; }).sort(function (a, b) { var _a, _b, _c, _d; return ((_b = (_a = spaceList[b]) === null || _a === void 0 ? void 0 : _a.extraSpace) !== null && _b !== void 0 ? _b : 0) - ((_d = (_c = spaceList[a]) === null || _c === void 0 ? void 0 : _c.extraSpace) !== null && _d !== void 0 ? _d : 0); });
}
//# sourceMappingURL=Geometry.js.map