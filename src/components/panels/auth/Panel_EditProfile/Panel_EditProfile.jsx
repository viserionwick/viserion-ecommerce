// Essentials
import { useEffect, useState } from "react";

// Contexts
import { useAuthContext } from "../../../../contexts/Auth";
import { usePanelContext } from "../../../../contexts/Panel";

// Style
import "./Panel_EditProfile.scss";


const PANEL_EDITPROFILE = () => {

    // Contexts
    const { updateAuth, currentUserData: userData, deleteAccount } = useAuthContext();
    const { closePanel, panel_Agreement} = usePanelContext();

    // Set Countries List
    const [countries, setCountries] = useState([]);


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
      civility: userData.civility,
      firstName: userData.firstName,
      lastName: userData.lastName,
      country: userData.country,
      subscriptionAgreement: userData.subscriptionAgreement
    });

    // Input States: Errors
    const [civilityError, setCivilityError] = useState(false);
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [countryError, setCountryError] = useState(false);

    // Input States: Empty Input Errors
    const [emptyInputErrorMessage, setEmptyInputErrorMessage] = useState(false);

    let isEmptyInputErrorMessage = false;
    if (!civilityError && !firstNameError && !lastNameError && !countryError ) {
      isEmptyInputErrorMessage = false;
    }

    useEffect(() => {
      if (isEmptyInputErrorMessage) {
        setEmptyInputErrorMessage(false)
      }
    }, [formData, isEmptyInputErrorMessage]);

    // Input States: Handle
    const handleInput = (e) => {
      const name = e.target.name;
      const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

      // Set Data
      setFormData({ ...formData, [name]: value })

      // Handle Empty
      if (name === "civility") { setCivilityError(false); }
      if (name === "firstName") { setFirstNameError(false); }
      if (name === "lastName") { setLastNameError(false); }
      if (name === "country" && value !== "selectCountryDefault") { setCountryError(false); }
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
     
      let isCountry = false;
      if (formData.country.replace(regex, ' ').trim() === "" || formData.country === "selectCountryDefault" || formData.country === undefined) { isCountry = false; setCountryError(true); } else { isCountry = true; setCountryError(false); }
      
      if (isCivility && isFirstName && isLastName && isCountry) {
        empty = false;
      }


      // Submit if there is no empty input
      if (!empty) {
        closePanel();

        updateAuth({
          fullName: formData.firstName.replace(regex, ' ').trim() +" "+ formData.lastName.replace(regex, ' ').trim(),
          firstName: formData.firstName.replace(regex, ' ').trim(),
          lastName: formData.lastName.replace(regex, ' ').trim(),
          country: formData.country.replace(regex, ' ').trim(),
          civility: formData.civility.replace(regex, ' ').trim(),
          subscriptionAgreement: formData.subscriptionAgreement
        });

        setEmptyInputErrorMessage(false);
      }
      else {
        window.scrollTo(0, 0);
        setEmptyInputErrorMessage(true);
      }

    }

    // Handle Delete My Account
    const handleDelete = () => {

      const content = <p>
        You will lose all and can't recover any of your data including <b>orders</b>, <b>addresses</b> and <b>personal information</b> if you delete your account.
        </p>;

      const onDelete = () => {
        closePanel();
        deleteAccount();
      } 
      const onCancel = () => {
        closePanel();
      }

      panel_Agreement("Account Removal", content, "Delete My Account", "Cancel", onDelete, onCancel);
    }

    return (
      <div className="p-editProfile">
        <div className="p-editProfile--details">
          <p>Fields with an asterisk * are required.</p>
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
                I would like to receive information and updates about Balenciaga and Kering new activities, exclusive products, tailored services (including through phone, SMS, MMS and instant messaging applications), and to have a personalised client experience based on my interests.
              </span>
            </label>
          </div>


          <div className="p-editProfile--buttons fRow fButtons--center">
            <button type='submit' className="buttonS2">Update my profile</button>
            <button type='button' className="buttonS1" onClick={handleDelete}>Delete My Account</button>
          </div>

          </form>
      </div>
    )
  }
  
  export default PANEL_EDITPROFILE