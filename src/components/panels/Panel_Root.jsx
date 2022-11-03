// Custom Hooks
import { usePanelContext } from "../../contexts/Panel";

// Scss
import "./Panel_Root.scss";

const PANEL_ROOT = () => {

    const { panel, panelOpen, panelTitle, closePanel } = usePanelContext();

    return (
        <>
            {
                panelOpen &&
                <div className="showPanel">
                    <div className="showPanelBackground" onClick={closePanel}></div>
                    <div className="showPanelContent">
                        <h1>{panelTitle}</h1>
                        <button onClick={closePanel}><i className="fa-solid fa-xmark"></i></button>
                        <div>
                            {panel}
                        </div>
                    </div>
                </div>
            }
        </>
    );
}
 
export default PANEL_ROOT;