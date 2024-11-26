import React from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { DraggableNodeOptions, LayoutRect } from '../context';
export declare const ScrollState: {
    END: number;
};
export declare function resolveScrollRef(ref: any): any;
export declare function useDraggable<T>(options?: DraggableNodeOptions): {
    nodeRef: React.MutableRefObject<T>;
    offset: React.MutableRefObject<{
        x: number;
        y: number;
    }>;
    draggableNodes: import("../context").DraggableNodes;
    layout: React.MutableRefObject<LayoutRect>;
    gestureContext: {
        ref: React.RefObject<unknown>;
        eventManager: import("../eventmanager").default;
    };
};
/**
 * Create a custom scrollable view inside the action sheet.
 * The scrollable view must implement `onScroll`, and `onLayout` props.
 * @example
 * ```tsx
  const handlers = useScrollHandlers<RNScrollView>();
  return <NativeViewGestureHandler
    simultaneousHandlers={handlers.simultaneousHandlers}
  >
  <ScrollableView
    {...handlers}
  >
  </ScrollableView>
  
  </NativeViewGestureHandler>
 * ```
 */
export declare function useScrollHandlers<T>(options?: DraggableNodeOptions): {
    ref: React.MutableRefObject<T>;
    simultaneousHandlers: React.RefObject<unknown>;
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    scrollEventThrottle: number;
    onLayout: () => void;
};
//# sourceMappingURL=use-scroll-handlers.d.ts.map