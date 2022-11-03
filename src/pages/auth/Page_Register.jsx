// Essentials
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// Contexts
import { useAuthContext } from '../../contexts/Auth';

// Hooks
import useTabTitle from '../../hooks/useTabTitle';

// Styles
import "./Page_Auth.scss";

function PAGE_REGISTER() {

  useTabTitle("Register");

  const { currentUser: user, signUp, signUpError, loading } = useAuthContext();

  
  // Set Countries List
  const [countries, setCountries] = useState([]);
  const [countryCodes, setCountryCodes] = useState([]);


  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
    .then((res) => res.json())
    .then((data) => {
      setCountries(
        data.sort(function(a, b){
        var nameA = a.name.common.toLowerCase(), nameB = b.name.common.toLowerCase();
        if (nameA < nameB)
          return -1;
        if (nameA > nameB)
          return 1;
        return 0;
        })
      );
      
    })
  }, []);


  // Input States
  const [formData, setFormData] = useState({
    civility: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    country: "",
    privacyAgreement: false,
    subscriptionAgreement: false
  });

  // Input States: Errors
  const [civilityError, setCivilityError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [countryError, setCountryError] = useState(false);
  const [privacyAgreementError, setPrivacyAgreementError] = useState(false);

  // Input States: Database Errors
  const [throwError, setThrowError] = useState(null);

  // Input States: Empty Input Errors
  const [emptyInputErrorMessage, setEmptyInputErrorMessage] = useState(false);

  let isEmptyInputErrorMessage = false;
  if (!civilityError && !firstNameError && !lastNameError && !emailError && !passwordError && !countryError && !privacyAgreementError) {
    isEmptyInputErrorMessage = false;
  }

  useEffect(() => {
    if (isEmptyInputErrorMessage) {
      setEmptyInputErrorMessage(false)
    }
  }, [formData, isEmptyInputErrorMessage]);
  



  // Handle: Input
  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

    // Set Data
    setFormData({ ...formData, [name]: value })


    // Handle Empty
    if (name === "civility") { setCivilityError(false); }
    if (name === "firstName") { setFirstNameError(false); }
    if (name === "lastName") { setLastNameError(false); }
    if (name === "email") { setEmailError(false); }
    if (name === "password") { setPasswordError(false); }
    if (name === "country" && value !== "selectCountryDefault") { setCountryError(false); }
    if (name === "privacyAgreement") { setPrivacyAgreementError(false); }

  }
  
  

  // Handle: Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const regex = /\s{2,}/g;

    // Handle Empty Errors
    let empty = true;

    let isCivility = false;
    if (formData.civility.replace(regex, ' ').trim() === "" || formData.civility === undefined) { isCivility = false; setCivilityError(true); } else { isCivility = true; setCivilityError(false); }
    
    let isFirstName = false;
    if (formData.firstName.replace(regex, ' ').trim() === "" || formData.firstName === undefined) { isFirstName = false; setFirstNameError(true); } else { isFirstName = true; setFirstNameError(false); }
    
    let isLastName = false;
    if (formData.lastName.replace(regex, ' ').trim() === "" || formData.lastName === undefined) { isLastName = false; setLastNameError(true); } else { isLastName = true; setLastNameError(false); }
    
    let isEmail = false;
    if (formData.email.replace(regex, ' ').trim() === "" || formData.email === undefined) { isEmail = false; setEmailError(true); } else { isEmail = true; setEmailError(false); }
    
    let isPassword = false;
    if (formData.password.replace(regex, ' ').trim() === "" || formData.password === undefined) { isPassword = false; setPasswordError(true); } else { isPassword = true; setPasswordError(false); }
    
    let isCountry = false;
    if (formData.country.replace(regex, ' ').trim() === "" || formData.country === "selectCountryDefault" || formData.country === undefined) { isCountry = false; setCountryError(true); } else { isCountry = true; setCountryError(false); }
    
    let isPrivacyAgreement = false;
    if (formData.privacyAgreement === false || formData.privacyAgreement === undefined) { isPrivacyAgreement = false; setPrivacyAgreementError(true); } else { isPrivacyAgreement = true; setPrivacyAgreementError(false); }

    if (isCivility && isFirstName && isLastName && isEmail && isPassword && isCountry && isPrivacyAgreement) {
      empty = false;
    }



    // Submit if there is no empty input
    if (!empty) {
      signUp(
        formData.email.replace(regex, ' ').trim(), 
        formData.password.replace(regex, ' ').trim(),
        formData.firstName.replace(regex, ' ').trim(),
        formData.lastName.replace(regex, ' ').trim(),
        formData.country.replace(regex, ' ').trim(),
        formData.civility.replace(regex, ' ').trim(),
        formData.subscriptionAgreement
      );
      setEmptyInputErrorMessage(false);
    }
    else {
      window.scrollTo(0, 0);
      setEmptyInputErrorMessage(true);
    }

  }

  // Handle Database Errors
  useEffect(() => {
    signUpError ? setThrowError(signUpError) : setThrowError(null);

    if (signUpError) {
      if (signUpError.includes("auth/invalid-email")) {
        setThrowError("Something is wrong with the email address.")
        setEmailError(true)
        setPasswordError(false)
      }
      else if (signUpError.includes("auth/email-already-in-use")) {
        setThrowError("E-mail address is in use.")
        setEmailError(false)
        setPasswordError(false)
      }
      else if (signUpError.includes("auth/invalid-password")) {
        setThrowError("Password must be at least 6 characters long.")
        setPasswordError(true)
        setEmailError(false)
      }
      else if (signUpError.includes("auth/weak-password")) {
        setThrowError("Password must be at least 6 characters long.")
        setPasswordError(true)
        setEmailError(false)
      }
      else {
        setThrowError("Something went wrong.")
      }
    }
  }, [signUpError, loading]);

  useEffect(() => {
    window.scroll(0,0);
  }, [signUpError]);

  return (
    <>
    {
    !loading ?
      !user ?
        countries &&
        <div className="p-auth">
          <h1 className="p-auth--header">
            Register
          </h1>
          <div className="p-auth--row">
            <div className="p-auth--details">
              <p>Fields with an asterisk * are required.</p>
              {
                <p className='fError'>{throwError}</p>
              }
              {
              emptyInputErrorMessage ?
              <p className='fError'>Please make sure to fill and check the required fields. </p>
              :
              ""
              }
            </div>
            <form onSubmit={handleSubmit} className="formS1">

              <div className="fRow">
                <div className={`${civilityError ? "fError" : ""} fColumn`}>
                  <label htmlFor="civility" className="fRadio">
                    <span>Civility *</span>
                    <div className="fRow fRadios--left">
                      <label htmlFor="civility1">
                        <input
                          type="radio"
                          name="civility"
                          id="civility1"
                          value="civility1"
                          checked={formData.civility === "civility1"}
                          onChange={handleInput}
                        />
                        <span>Mr.</span>
                      </label>
                      
                      <label htmlFor="civility2">
                        <input
                          type="radio"
                          name="civility"
                          id="civility2"
                          value="civility2"
                          checked={formData.civility === "civility2"}
                          onChange={handleInput}
                        />
                        <span>Miss, Mrs, Ms</span>
                      </label>
                      
                      <label htmlFor="civility3">
                        <input
                          type="radio"
                          name="civility"
                          id="civility3"
                          value="civility3"
                          checked={formData.civility === "civility3"}
                          onChange={handleInput}
                        />
                        <span>Mx</span>
                      </label>
                      
                      <label htmlFor="civility4">
                        <input
                          type="radio"
                          name="civility"
                          id="civility4"
                          value="civility4"
                          checked={formData.civility === "civility4"}
                          onChange={handleInput}
                        />
                        <span>I'd rather not say</span>
                      </label>
                    </div>
                  </label>
                  
                </div>
              </div>

              <div className="fRow">
                <div className={`${firstNameError ? "fError" : ""} fColumn`}>
                  <label htmlFor="firstName" className="fInput">
                    <span>First Name *</span>
                    <input
                      type="text"
                      name='firstName'
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleInput}
                      autoComplete="off"
                      spellCheck="false"
                    />
                  </label>
                  
                </div>
                <div className={`${lastNameError ? "fError" : ""} fColumn`}>
                  <label htmlFor="lastName" className="fInput">
                    <span>Last Name *</span>
                    <input
                      type="text"
                      name='lastName'
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleInput}
                      autoComplete="off"
                      spellCheck="false"
                    />
                  </label>
                </div>
              </div>

              <div className="fRow">
                <div className={`${emailError ? "fError" : ""} fColumn`}>
                  <label htmlFor="email" className="fInput">
                    <span>Email Address *</span>
                    <input
                      type="email"
                      name='email'
                      id="email"
                      value={formData.email}
                      onChange={handleInput}
                      autoComplete="off"
                      spellCheck="false"
                    />
                  </label>
                </div>
              </div>

              <div className="fRow">
                <div className={`${passwordError ? "fError" : ""} fColumn`}>
                  <label htmlFor="password" className="fInput">
                    <span>Password *</span>
                    <input
                      type="password"
                      name='password'
                      id="password"
                      value={formData.password}
                      onChange={handleInput}
                      autoComplete="off"
                      spellCheck="false"
                    />
                  </label>
                </div>
              </div>

              <div className="fRow">
                <div className={`${countryError ? "fError" : ""} fColumn`}>
                  <label htmlFor="country" className="fInput--select">
                    <span>Country / Region *</span>
                    <select name="country" id="country" value={formData.country} onChange={handleInput}>
                      <option value="selectCountryDefault">Select Your Country</option>
                    {
                    countries.map((country) => (
                      <option value={country.cca3} key={country.cca3}>{country.name.common}</option>
                    ))
                    }
                    </select>
                  </label>
                </div>
              </div>

              <div className="fRow">
                <div className="fColumn">
                  <p id='p-auth__legal'>
                  <b>You are invited to read our privacy policy in full.</b> In any event, here are some key points we would like to share with you: <br /><br />
                  <b>You are about to create your Balenciaga and Kering profile.</b> This will allow Balenciaga and Kering to offer you a personalized and tailored experience, provide you with products, services and information you request from Balenciaga and Kering and communicate with you. All your personal information will be kept, used and linked to your Balenciaga and Kering profile. Your profile could include information we obtained directly from you as well as from our retailers and other commercial partners. As we operate globally, <b>we may securely share your personal information with companies of our group and our approved partners located around the world. We will implement safeguards to protect your personal information.</b> We may use any contact information you share with us to contact you. <br /><br />
                  Privacy laws may grant you certain rights such as the right to access, delete, modify and rectify your data, or to restrict or object to processing, as well as the right to data portability. You can also lodge a complaint with your competent regulator. You can withdraw your consent or delete your profile at any time. For further information regarding our privacy practices and your rights, please contact us at privacy@balenciaga.com.
                  </p>
                </div>
              </div>

              <div className={`${privacyAgreementError ? "fError" : ""} fRow fCheckbox--left`}>
                <label htmlFor="privacyAgreement">
                  <input
                    type="checkbox"
                    name="privacyAgreement"
                    id="privacyAgreement"
                    checked={formData.privacyAgreement}
                    onChange={handleInput}
                  />
                  <span>
                    I acknowledge the terms of the privacy policy. *
                  </span>
                </label>
              </div>

              <div className="fRow fCheckbox--left">
                <label htmlFor="subscriptionAgreement">
                  <input
                    type="checkbox"
                    name="subscriptionAgreement"
                    id="subscriptionAgreement"
                    checked={formData.subscriptionAgreement}
                    onChange={handleInput}
                  />
                  <span>
                    I would like to receive information and updates about Balenciaga and Kering new activities, exclusive products, tailored services (including through phone, SMS, MMS and instant messaging applications), and to have a personalised client experience based on my interests. <br/><br/>
                    By agreeing to receive customised information and updates, you authorize Balenciaga and Kering to deliver marketing calls and messages to you, including using an automatic telephone dialing system or an artificial or prerecorded voice, to the phone number provided on your profile. Balenciaga and Kering does not require you to agree to receive such calls or messages as a condition of purchasing any products or services.
                  </span>
                </label>
              </div>


              <div className="fRow fButtons--center">
                {
                  !loading ?
                  <button type='submit' className="buttonS2">Create my profile</button>
                  :
                  <button type='button' className="buttonS2" disabled>Please wait...</button>
                }
              </div>

              
              <div className="fRow">
                <div className="fColumn">
                  <p>
                  It is mandatory to tick the box with (*) to create your Balenciaga and Kering profile.<br/>
                  By creating your Balenciaga and Kering profile, you confirm that you have reached the age of consent in your country of residence (or, if you are under the age of consent, that your parent or legal guardian also agrees to such registration).
                  </p>
                </div>
              </div>

            </form>
          </div>
        </div>
      :
      <Navigate to="/account"/>
    :
    <div className='loadingZone'>
        <span className='loadingS1'/>
    </div>
    }
    </>
  )
}

export default PAGE_REGISTER