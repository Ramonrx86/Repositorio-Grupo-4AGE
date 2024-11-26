import { RefObject } from 'react';
export type ContentSize = {
    w: number;
    h: number;
};
export type LayoutRect = {
    w: number;
    h: number;
    x: number;
    y: number;
    px: number;
    py: number;
};
export declare const PanGestureRefContext: import("react").Context<{
    ref: RefObject<unknown>;
    eventManager: import("./eventmanager").default;
}>;
export type DraggableNodeOptions = {
    hasRefreshControl?: boolean;
    refreshControlBoundary: number;
};
export declare const usePanGestureContext: () => {
    ref: RefObject<unknown>;
    eventManager: import("./eventmanager").default;
};
export type NodesRef = {
    offset: RefObject<{
        x: number;
        y: number;
    }>;
    ref: RefObject<any>;
    rect: RefObject<LayoutRect>;
    handlerConfig: DraggableNodeOptions;
}[];
export type DraggableNodes = {
    nodes: RefObject<NodesRef>;
};
export declare const DraggableNodesContext: import("react").Context<DraggableNodes>;
export declare const useDraggableNodesContext: () => DraggableNodes;
//# sourceMappingURL=context.d.ts.map