import { createContext, useContext } from "react";
import { MixpanelContextType } from "./types";

export const MixpanelContext = createContext<MixpanelContextType | null>(null);

export const useMixpanel = () => {
    const context = useContext(MixpanelContext);
    if (!context) {
        throw new Error("useMixpanel must be used within a MixpanelProvider");
    }
    return context;
}
