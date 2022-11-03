// Essentials
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Firebase
import { analytics } from "../../firebase/Config";
import { setAnalyticsCollectionEnabled } from 'firebase/analytics';

// Style
import "./useCookieConsent.scss";


// Jotai
import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// GLOBAL STATES
export const cookieConsent_atom = atomWithStorage("cookieConsent", {
    preferences: false,
    statistics: false,
    marketing: false
});

export const openCookiePanel_atom = atom(undefined);

const useCookieConsent = () => {
    
    // Consent    
    const [cookieConsent, setCookieConsent] = useAtom(cookieConsent_atom);
    const [cookieConsentCheck, setCookieConsentCheck] = useState(localStorage.getItem("cookieConsent"));

    useEffect(() => {
        const detectChange = () => {
            setCookieConsentCheck(localStorage.getItem("cookieConsent"));
        }

        window.addEventListener('storage', detectChange);

        return () => {
            window.removeEventListener("storage", detectChange);
        }
    }, []);


    // Consent States
    const [consentTabs, setConsentTabs] = useState({
        necessary: {
            name: "Necessary",
            info: "Necessary cookies help make a website usable by enabling basic functions like page navigation and access to secure areas of the website. The website cannot function properly without these cookies."
        },
        preferences: {
            name: "Preferences",
            info: "Preference cookies enable a website to remember information that changes the way the website behaves or looks, like your preferred language or the region that you are in.",
            consent: cookieConsent.preferences
        },
        statistics: {
            name: "Statistics",
            info: "Strictly for our eyes only, this is to help us improve our site based on how you use it",
            consent: cookieConsent.statistics
        },
        marketing: {
            name: "Marketing",
            info: "This tells us it's OK for us to use your information for marketing specifically. This makes ads more personalized. ",
            consent: cookieConsent.marketing
        }
    });

    useEffect(() => {
        setConsentTabs({
            necessary: {
                name: consentTabs.necessary.name,
                info: consentTabs.necessary.info
            },
            preferences: {
                name: consentTabs.preferences.name,
                info: consentTabs.preferences.info,
                consent: cookieConsent.preferences
            },
            statistics: {
                name: consentTabs.statistics.name,
                info: consentTabs.statistics.info,
                consent: cookieConsent.statistics
            },
            marketing: {
                name: consentTabs.marketing.name,
                info: consentTabs.marketing.info,
                consent: cookieConsent.marketing
            }
        });
    }, [cookieConsent]);

    const onConsentChange = (e) => {
        const name = e.target.name;
        const value = e.target.checked;
        if (name !== "necessary") {
            setConsentTabs({...consentTabs, [name] : {
                name: consentTabs[name].name,
                info: consentTabs[name].info,
                consent: value
            }})
        }
    }


    // Consent Actions
    const onAcceptAll = () => { // Consent To All

        setCookieConsent({
            preferences: true,
            statistics: true,
            marketing: true
        });

        setOpenCookiePanel(false);
        setContent({page: "InitPage"})
    }

    const onConfirm = () => { // Consent To Current States

        setCookieConsent({
            preferences: consentTabs.preferences.consent,
            statistics: consentTabs.statistics.consent,
            marketing: consentTabs.marketing.consent
        });

        setOpenCookiePanel(false);
        setContent({page: "InitPage"})
    }


    // Open Panel
    const [openCookiePanel, setOpenCookiePanel] = useAtom(openCookiePanel_atom);
    const openCookieSettings = () => {
        setOpenCookiePanel(true);
    }

    // Render Panel Page
    const InitPage = () => {

        const onDetails = () => {
            setContent({page: "DetailsPage"});
        }

        return (
            <div className="wrapper">
                <div className="content">
                    <h1>Cookies?</h1>
                    <p>
                        We and our partners use cookies to give you the best possible experience on our site. If you hit OK, we'll assume you're happy with it.
                        You can find out more about how we use cookies and to edit your consent <button onClick={onDetails}>by clicking here</button>.
                        <Link to="/legal?category=cookie">See our Cookie policy</Link>.
                        
                    </p>
                </div>
                <div className="buttons">
                    <button onClick={onAcceptAll} className="buttonS2"><i className="fa-solid fa-cookie-bite"></i>OK</button>
                </div>
            </div>
        )
    }

    const DetailsPage = () => {

        const onBack = () => {
            setContent({page: "InitPage"});
        }

        return (
            <div className="wrapper">
                <div className="content">
                    <h1>
                        <button onClick={onBack} className="buttonClear2">
                            <i className="fa-solid fa-arrow-left" />
                        </button>
                        Settings
                    </h1>
                </div>
                <div className="buttons">
                    {
                        Object.keys(consentTabs).map((tabName, i) => (
                            <button className="tabs" key={i} onClick={() => setContent({page: "TabsPage", props: tabName})} >
                                {consentTabs[tabName].name}
                                <i className="fa-solid fa-arrow-right" />
                            </button>
                        ))
                    }
                    <button onClick={onAcceptAll} className="buttonS2">Accept All</button>
                    <button onClick={onConfirm} className="buttonClear">Confirm My Choices</button>
                </div>
            </div>
        )
    }


    const TabsPage = ({tabName}) => {

        const onBack = () => {
            setContent({page: "DetailsPage"});
        }

        return (
            <div className="wrapper">
                <div className="content">
                    <h1 className="tab">
                        <button onClick={onBack} className="buttonClear2">
                            <i className="fa-solid fa-arrow-left" />
                        </button>
                        { consentTabs[tabName].name }
                        {
                            tabName !== "necessary" ?
                            <input
                                type="checkbox"
                                name={tabName}
                                checked={consentTabs[tabName].consent}
                                onChange={onConsentChange}
                            />
                            :
                            <span />
                        }
                    </h1>
                    <p>
                        { consentTabs[tabName].info }
                    </p>
                </div>
            </div>
        )
    }

    // Render Panel
    const [content, setContent] = useState({page: "InitPage"});
    const renderContent = (content) => {

        const pages = {
            InitPage,
            DetailsPage,
            TabsPage
        }

        if (pages[content.page]){
            return content.props ? 
            React.createElement(pages[content.page], {tabName: content.props})
            :
            React.createElement(pages[content.page])
        }

        return null;
    }
    
    const CookieConsentAsk = () => {  
        const [openCookiePanel] = useAtom(openCookiePanel_atom);
        

        useEffect(() => {
            window.dispatchEvent(new Event("storage"));
        }, []);

        return (
            <>
            {
                !cookieConsentCheck || openCookiePanel ?
                <div className="cookieConsent">
                    { renderContent(content) }
                </div>
                :
                <></>
            }
            </>
        )
    }


    // Cookie Map
    useEffect(() => {
        if (cookieConsentCheck) {

            if (cookieConsent) { 
                if(cookieConsent.preferences) { // Preferences Cookies ON
                    
                } else {  // Preferences Cookies OFF
                    
                }
                

                if(cookieConsent.marketing) { // Marketing Cookies ON

                } else {  // Marketing Cookies OFF
                    
                }
                

                if(cookieConsent.statistics) { // Statistics Cookies ON

                    setAnalyticsCollectionEnabled(analytics, true);

                } else { // Statistics Cookies OFF
                    
                    setAnalyticsCollectionEnabled(analytics, false);

                }
            } 

        } else { // ALL TURNED OFF: Initial. No consent given yet.

            // Statistics Cookies OFF
            setAnalyticsCollectionEnabled(analytics, false);
        }
    }, [cookieConsent, cookieConsentCheck]);
    

  return { CookieConsentAsk, openCookieSettings }
}

export default useCookieConsent