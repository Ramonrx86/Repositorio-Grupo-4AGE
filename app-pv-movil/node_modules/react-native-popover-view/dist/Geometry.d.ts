import { StyleProp, ViewStyle } from 'react-native';
import { Rect, Size, Point, Placement, PopoverProps } from './Types';
declare type ComputeGeometryBaseProps = {
    requestedContentSize: Size;
    displayArea: Rect;
    debug: (line: string, obj?: unknown) => void;
    offset?: number;
};
declare type ComputeGeometryProps = ComputeGeometryBaseProps & {
    placement?: Placement | Array<Placement>;
    previousPlacement?: Placement;
    fromRect: Rect | null;
    arrowSize: Size;
    popoverStyle: StyleProp<ViewStyle>;
    arrowShift?: number;
    popoverShift?: PopoverProps['popoverShift'];
};
export declare class Geometry {
    popoverOrigin: Point;
    anchorPoint: Point;
    placement: Placement;
    forcedContentSize: Size;
    viewLargerThanDisplayArea: {
        width: boolean;
        height: boolean;
    };
    constructor({ popoverOrigin, anchorPoint, placement, forcedContentSize, viewLargerThanDisplayArea }: {
        popoverOrigin: Point;
        anchorPoint: Point;
        placement: Placement;
        forcedContentSize: Size;
        viewLargerThanDisplayArea: {
            width: boolean;
            height: boolean;
        };
    });
    static equals(a: Geometry, b: Geometry): boolean;
}
export declare function computeGeometry(options: ComputeGeometryProps): Geometry;
export {};
