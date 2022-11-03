// Essentials
import { createContext, useContext, useState } from "react";

// Style
import "../components/panels/Panel_Root.scss";


const PanelContext = createContext({});
const usePanelContext = () => useContext(PanelContext);

const PanelProvider = ({children}) => {
    // States
    const [panel, setPanel] = useState(null);
    const [panelOpen, setPanelOpen] = useState(false);
    const [panelTitle, setPanelTitle] = useState(null);

    // Style
    if(panelOpen){
        document.body.style.overflow = "hidden";
    }
    else{
        document.body.style.removeProperty("overflow");
    }
    
    // Open Panel
    const showPanel = (panel, title = null) => {
        if(panel){
            setPanel(panel);
            setPanelOpen(true);
            setPanelTitle(title);
        }else{
            setPanel(null);
            setPanelOpen(false);
            setPanelTitle(null);
        }
    }

    // Close Panel
    const closePanel = () => {
        setPanel(null);
        setPanelOpen(false);
    }


    // -- PANELS -- //

    // Panels: Agreement
    const panel_Agreement = (title, content, agreeText, cancelText, onAgree, onCancel) => {
        setPanel(
            <div className="panel_agreement">
                <div className="panel_agreement--content">
                    {content}
                </div>
                <div className="panel_agreement--buttons">
                    <button onClick={onAgree} className="buttonS2">{agreeText}</button>
                    <button onClick={onCancel} className="buttonS1">{cancelText}</button>
                </div>
            </div>
        );
        setPanelOpen(true);
        setPanelTitle(title);
    }

    const value = {
        showPanel, closePanel,
        panel, setPanel,
        panelOpen, setPanelOpen,
        panelTitle, setPanelTitle,
        /* PANELS */
        panel_Agreement
    }

    return (
        <PanelContext.Provider value={value}>
            {children}
        </PanelContext.Provider>
    );
}

export { PanelProvider, usePanelContext };