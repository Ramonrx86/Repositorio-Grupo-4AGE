/// <reference types="react" />
declare const useSheetManager: ({ id, onHide, onBeforeShow, onContextUpdate, }: {
    id?: string;
    onHide: (data?: any) => void;
    onBeforeShow?: (data?: any) => void;
    onContextUpdate: () => void;
}) => {
    visible: boolean;
    setVisible: import("react").Dispatch<import("react").SetStateAction<boolean>>;
};
export default useSheetManager;
//# sourceMappingURL=use-sheet-manager.d.ts.map