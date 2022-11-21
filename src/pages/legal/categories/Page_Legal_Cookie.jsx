// Style
import useCookieConsent from "../../../hooks/useCookieConsent/useCookieConsent";
import "../Page_Legal.scss";

const PAGE_LEGAL_COOKIE = () => {

  const { openCookieSettings } = useCookieConsent();

  return (
    <div className="p-legal--content">
      <button onClick={openCookieSettings}>Cookie Settings</button>
      DO WE USE COOKIES OR OTHER ONLINE ADVERTISING TECHNOLOGIES?
 

 We use cookies to personalise content and ads, to provide social media features and to analyse our traffic data. We also share information on your use of our site with our social media, advertising and analytics partners. You can read more about any of our purposes or the vendors that we use by clicking on ‘Cookie Settings.’ This preference centre is accessible at any time through the ‘Cookie Settings’ button located on every page.
 
 When you visit any website, it may store or retrieve information using your browser, mostly in the form of cookies. This information might be personal information about you, your preferences or your device and is mostly used to make the site work as you expect it to. The information does not usually directly identify you, but it can give you a more personalised web experience. Because we respect your right to privacy, you can choose not to allow some types of cookies.
    </div>
  )
}

export default PAGE_LEGAL_COOKIE