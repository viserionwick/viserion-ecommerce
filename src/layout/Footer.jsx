// Essentials
import { Link } from "react-router-dom";

// Contexts
import { usePanelContext } from '../contexts/Panel';

// Panels
import PANEL_MAILINGLIST from '../components/panels/mailing_list/Panel_MailingList';

// Styles
import "./Layout.scss"

const FOOTER = () => {

  // Dropdown
  const dropDownHandler = (e) => {
    const header = e.target.offsetParent;
    
    if (header.classList.contains("opened")) {
      header.classList.remove("opened");
    }
    else {
      header.classList.add("opened");
    }

    // Close Others
    const otherHeaders = document.getElementsByClassName("l-footer__column");

    for (var i = 0; i < otherHeaders.length; i++) {
      const headers = otherHeaders[i];
      const currentHeader = e.target.offsetParent;

      if (headers !== currentHeader) {
        headers.classList.remove("opened");
      }
    }
  }

  

  // Emailing Panel
  const { showPanel } = usePanelContext();
  const mailingList = () => {
    showPanel(<PANEL_MAILINGLIST />, "Newsletter");
  }
  

  return (
    <div className="l-footer">
      <div className="l-footer__row">
        <div className="l-footer__column">
          <div onClick={dropDownHandler}>
            <h1>Client Services</h1>
            <i className="fa-solid fa-chevron-down"></i>
          </div>
          <div>
            <Link to="/faq">FAQ</Link>
            <Link to="/faq?category=shipping">Shipping</Link>
            <Link to="/faq?category=payment">Payment</Link>
          </div>
        </div>
        <div className="l-footer__column">
          <div onClick={dropDownHandler}>
            <h1>Contact</h1>
            <i className="fa-solid fa-chevron-down"></i>
          </div>
          <div>
            <Link to="/contact">Email Us</Link>
            <a href="tel:+16468891895" rel="noreferrer">Call Us +1 646 889 1895</a>
            <p>Our Client Advisors are available Mon-Sat 9am - 9pm</p>
          </div>
        </div>
        <div className="l-footer__column">
          <div onClick={dropDownHandler}>
            <h1>The Company</h1>
            <i className="fa-solid fa-chevron-down"></i>
          </div>
          <div>
            <Link to="/legal">Legal</Link>
            <Link to="/legal?category=return">Return Policy</Link>
            <Link to="/legal?category=cookie">Cookie Policy</Link>
            <Link to="/legal?category=privacy">Privacy Policy</Link>
            <Link to="/legal?category=termsAndConditions">Terms & Conditions</Link>
          </div>
        </div>
        <div className="l-footer__column">
          <div onClick={dropDownHandler}>
            <h1>Newslatter</h1>
            <i className="fa-solid fa-chevron-down"></i>
          </div>
          <div>
            <button onClick={mailingList}>Subscribe to our newsletter</button>
          </div>
        </div>
        <div className="l-footer__column">
          <div onClick={dropDownHandler}>
            <h1>Connect</h1>
            <i className="fa-solid fa-chevron-down"></i>
          </div>
          <div>
            <a target="_blank" href="https://www.facebook.com/balenciaga" rel="noreferrer">Facebook</a>
            <a target="_blank" href="https://www.twitter.com/balenciaga" rel="noreferrer">Twitter</a>
            <a target="_blank" href="https://www.instagram.com/balenciaga" rel="noreferrer">Instagram</a>
          </div>
        </div>
      </div>
      <div className="l-footer__row">
        <p>
        © {new Date().getFullYear()} Made all by <a target="_blank" href="https://www.viserionwick.com" rel="noreferrer" className="buttonClear">Viserion Wick</a>.
        </p>
        <p>
          A mock up e-commerce website.
        </p>
      </div>
    </div>
  )
}

export default FOOTER