// Essentials
import { useState } from "react";
import { Link } from "react-router-dom";

// Contexts
import { usePanelContext } from "../../../contexts/Panel";

// Style
import "./Panel_MailingList.scss"

function PANEL_MAILINGLIST() {

  const { closePanel } = usePanelContext();

  // Input States
  const [emailInput, setEmailInput] = useState("");
  const [isSent, setIsSent] = useState(false);

  // Input States: Errors
  const [emailError, setEmailError] = useState(false);

  const handleInput = (e) => {
    const { value } = e.target;
    setEmailInput(value);

    // Handle Empty
    setEmailError(false);
  }

  

  const handleSubmit = (e) => {
    e.preventDefault();
    const regex = /\s{2,}/g;

    // Handle Empty Errors
    let empty = true;

    let isEmail = false;
    if (emailInput.replace(regex, ' ').trim() === "" || emailInput === undefined) { isEmail = false; setEmailError(true); } else { isEmail = true; setEmailError(false); }


    if (isEmail) {
      empty = false;
    }


    // Submit if there is no empty input
    
    // Success
    if (!empty) { 
      console.log("submit: " + emailInput);
      setIsSent(true);
    }
    // Error
    else {  
      window.scrollTo(0, 0);
    }    
  }

  return (
    <div className="p-mailingList">
      <div>
        { !isSent ?
        <form onSubmit={handleSubmit} className="formS1">
          <p className="p-mailingList__info">
            Sign up for e-mail updates on the latest Balenciaga collections, campaigns and videos.
          </p>
          <input
            type="email"
            name='mailingList'
            id='mailingList'
            className={`${emailError ? "fError" : ""} fInput`}
            placeholder="E-mail Address"
            value={emailInput}
            onChange={handleInput}
            autoComplete="off"
            spellCheck="false"
          />
          <p className="p-mailingList__legal">
            By signing up, you agree to stay in touch with Balenciaga. We will use your personal information to provide you with tailored updates regarding our latest collections, initiative, events, products and services. For more information about our privacy practices and your rights, please consult our <Link to="/legal?category=privacy" onClick={closePanel} className="linkify">privacy policy</Link>.
          </p>
          <button className="buttonS2">SUBSCRIBE</button>
        </form>
        :
        <p>
          Thank you for joining our mailling list!
        </p>  
        }
      </div>
    </div>
  )
}

export default PANEL_MAILINGLIST