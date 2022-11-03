// Essentials
import { useState } from "react";
import { Link } from "react-router-dom"

// Hooks
import useTabTitle from "../../hooks/useTabTitle";

// Style
import "./Page_Contact.scss";


const PAGE_CONTACT = () => {

    useTabTitle("Contact");

    // Input States
    const [formData, setFormData] = useState({
        subject: "",
        firstName: "",
        lastName: "",
        email: "",
        orderId: "",
        message: ""
    });
    const [isSent, setIsSent] = useState(false);

    // Input States: Errors
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [subjectError, setSubjectError] = useState(false);
    const [messageError, setMessageError] = useState(false);

    // Input States: Handle
    const handleInput = (e) => {
        const {name, value} = e.target;

        // Set Data
        setFormData({ ...formData, [name]: value })

        // Handle Empty
        if (name === "firstName") { setFirstNameError(false); }
        if (name === "lastName") { setLastNameError(false); }
        if (name === "email") { setEmailError(false); }
        if (name === "subject") { setSubjectError(false); }
        if (name === "message") { setMessageError(false); }
    }

    // Input States: Submit
    const handleSubmit = (e) => {
        e.preventDefault();
        const regex = /\s{2,}/g;
    
        // Handle Empty Errors
        let empty = true;
                
        let isFirstName = false;
        if (formData.firstName.replace(regex, ' ').trim() === "" || formData.firstName === undefined) { isFirstName = false; setFirstNameError(true); } else { isFirstName = true; setFirstNameError(false); }
        
        let isLastName = false;
        if (formData.lastName.replace(regex, ' ').trim() === "" || formData.lastName === undefined) { isLastName = false; setLastNameError(true); } else { isLastName = true; setLastNameError(false); }
        
        let isEmail = false;
        if (formData.email.replace(regex, ' ').trim() === "" || formData.email === undefined) { isEmail = false; setEmailError(true); } else { isEmail = true; setEmailError(false); }
        
        let isSubject = false;
        if (formData.subject.replace(regex, ' ').trim() === "" || formData.subject === undefined) { isSubject = false; setSubjectError(true); } else { isSubject = true; setSubjectError(false); }

        let isMessage = false;
        if (formData.message.replace(regex, ' ').trim() === "" || formData.message === undefined) { isMessage = false; setMessageError(true); } else { isMessage = true; setMessageError(false); }
    
        if (isFirstName && isLastName && isEmail && isSubject && isMessage) {
          empty = false;
        }
    
    
    
        // Submit if there is no empty input
        if (!empty) {
          console.log("success");
          console.log(
            formData.firstName.replace(regex, ' ').trim(),
            formData.lastName.replace(regex, ' ').trim(),
            formData.email.replace(regex, ' ').trim(), 
            formData.subject.replace(regex, ' ').trim(),
            formData.message.replace(regex, ' ').trim(),
          );
          setIsSent(true);
          window.scrollTo(0, 0);
        }
        else { 
          console.log("error");
          window.scrollTo(0, 0);
        }
    
    }

  return (
    <div className="p-contact">
        <h1 className="p-contact--header">
            Contact
        </h1>
        
        {!isSent ? <>

        <p className="p-contact--info">
            Our Customer Service will answer your enquiry as quickly as possible excluding bank holidays.
            <br/>
            * Required Fields
        </p>

        <form onSubmit={handleSubmit} className="p-contact--form formS1">

            <div className="fRow">
                <div className={`${firstNameError ? "fError" : ""} fColumn`}>
                    <label htmlFor="firstName" className="fInput">
                        <span>
                            First Name *
                        </span>
                        <input
                            type="text"
                            name="firstName" 
                            id="firstName"
                            autoComplete="off"
                            spellCheck="false"
                            value={formData.firstName}
                            onChange={handleInput}
                        />
                    </label>
                </div>
            </div>

            <div className="fRow">
                <div className={`${lastNameError ? "fError" : ""} fColumn`}>
                    <label htmlFor="lastName" className="fInput">
                        <span>
                            Last Name *
                        </span>
                        <input
                            type="text"
                            name="lastName" 
                            id="lastName"
                            autoComplete="off"
                            spellCheck="false"
                            value={formData.lastName}
                            onChange={handleInput}
                        />
                    </label>
                </div>
            </div>

            <div className="fRow">
                <div className={`${emailError ? "fError" : ""} fColumn`}>
                    <label htmlFor="email" className="fInput">
                        <span>
                            E-Mail *
                        </span>
                        <input
                            type="text"
                            name="email" 
                            id="email"
                            autoComplete="off"
                            spellCheck="false"
                            value={formData.email}
                            onChange={handleInput}
                        />
                    </label>
                </div>
            </div>

            <div className="fRow">
                <div className="fColumn">
                    <label htmlFor="orderId" className="fInput">
                        <span>
                            Order ID
                        </span>
                        <input
                            type="text"
                            name="orderId" 
                            id="orderId"
                            autoComplete="off"
                            spellCheck="false"
                            value={formData.orderId}
                            onChange={handleInput}
                        />
                    </label>
                </div>
            </div>

            <div className="fRow">
                <div className={`${subjectError ? "fError" : ""} fColumn`}>
                    <label htmlFor="subject" className="fInput">
                        <span>
                            Subject *
                        </span>
                        <input
                            type="text"
                            name="subject" 
                            id="subject"
                            autoComplete="off"
                            spellCheck="false"
                            value={formData.subject}
                            onChange={handleInput}
                        />
                    </label>
                </div>
            </div>

            <div className="fRow">
                <div className={`${messageError ? "fError" : ""} fColumn`}>
                    <label htmlFor="message" className="fInput">
                        <span>
                            Message *
                        </span>
                        <textarea
                            name="message"
                            id="message"
                            spellCheck="false"
                            value={formData.message}
                            onChange={handleInput}
                        />
                    </label>
                </div>
            </div>

            <div className="fRow">
                <div className="fColumn">
                    <p>
                        Balenciaga will use your personal information in order to be able to respond to your query.
                        For more information about our privacy practices and your rights, please consult our <Link to="/legal?category=privacy" >Privacy Policy</Link>.
                    </p>
                </div>
            </div>

            <div className="fRow fButtons--center">
                <button type='submit' className="buttonS2">Send</button>
            </div>

        </form>

        </> :
        
        <div className="p-contact--success">
            Successfully sent!
            <br />
            Our support team will respond within 1-2 working days.
            <br />
            Be sure to check out your e-mail.
        </div>

        }
    </div>
  )
}

export default PAGE_CONTACT