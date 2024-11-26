import React from 'react';
type ScreenRect = {
    screenX: number;
    screenY: number;
    width: number;
    height: number;
};
export declare function useKeyboard(enabled: boolean): {
    keyboardShown: boolean;
    coordinates: Readonly<{
        screenX: 0;
        screenY: 0;
        width: 0;
        height: 0;
    }> | {
        start: undefined | ScreenRect;
        end: ScreenRect;
    };
    keyboardHeight: number;
    pauseKeyboardHandler: React.MutableRefObject<boolean>;
    reset: () => void;
};
export {};
//# sourceMappingURL=useKeyboard.d.ts.map