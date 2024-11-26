import { createContext, createRef, useContext } from 'react';
import { actionSheetEventManager } from './eventmanager';
export var PanGestureRefContext = createContext({
    ref: createRef(),
    eventManager: actionSheetEventManager,
});
export var usePanGestureContext = function () { return useContext(PanGestureRefContext); };
export var DraggableNodesContext = createContext({
    nodes: createRef(),
});
export var useDraggableNodesContext = function () { return useContext(DraggableNodesContext); };
