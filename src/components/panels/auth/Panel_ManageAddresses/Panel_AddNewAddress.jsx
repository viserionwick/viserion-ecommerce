// Essentials
import { useEffect, useState } from "react";

// Contexts
import { useAuthContext } from "../../../../contexts/Auth";
import { usePanelContext } from "../../../../contexts/Panel";

// Panels
import PANEL_MANAGEADDRESSES from "./Panel_ManageAddresses";

// Style
import "./Panel_ManageAddresses.scss";


// Jotai
import { useAtom } from "jotai";

// GLOBAL STATES
import { addressBook_guest_atom } from "./Panel_ManageAddresses";

const PANEL_ADDNEWADDRESS = () => {

  // Contexts
  const { currentUserData: userData, updateAuth } = useAuthContext();
  const { showPanel } = usePanelContext();

  const [addressBook_guest, setAddressBook_guest] = useAtom(addressBook_guest_atom);

  const handleClose = () => {
    showPanel(<PANEL_MANAGEADDRESSES />, "Manage Addresses");
  }

  // Country List
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
    type: "HOME",
    firstName: "",
    lastName: "",
    addressLine_1: "",
    addressLine_2: "",
    country: "",
    defaultAddress: false
  });

  // Input States: Errors
  const [typeError, setTypeError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [addressLine_1Error, setAddressLine_1Error] = useState(false);
  const [addressLine_2Error, setAddressLine_2Error] = useState(false);
  const [countryError, setCountryError] = useState(false);

  // Input States: Empty Input Errors
  const [emptyInputErrorMessage, setEmptyInputErrorMessage] = useState(false);

  let isEmptyInputErrorMessage = false;
  if (!typeError && !firstNameError && !lastNameError && !addressLine_1Error  && !addressLine_2Error && !countryError ) {
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
    if (name === "type") { setTypeError(false); }
    if (name === "firstName") { setFirstNameError(false); }
    if (name === "lastName") { setLastNameError(false); }
    if (name === "addressLine_1") { setAddressLine_1Error(false); }
    if (name === "addressLine_2") { setAddressLine_2Error(false); }
    if (name === "country" && value !== "selectCountryDefault") { setCountryError(false); }
  }

  // Handle: Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const regex = /\s{2,}/g;

    // Handle Empty Errors
    let empty = true;

    let isType = false;
    if (formData.type.replace(regex, ' ').trim() === "" || formData.type === undefined) { isType = false; setTypeError(true); } else { isType = true; setTypeError(false); }
    
    let isFirstName = false;
    if (formData.firstName.replace(regex, ' ').trim() === "" || formData.firstName === undefined) { isFirstName = false; setFirstNameError(true); } else { isFirstName = true; setFirstNameError(false); }
    
    let isLastName = false;
    if (formData.lastName.replace(regex, ' ').trim() === "" || formData.lastName === undefined) { isLastName = false; setLastNameError(true); } else { isLastName = true; setLastNameError(false); }

    let isAddressLine_1 = false;
    if (formData.addressLine_1.replace(regex, ' ').trim() === "" || formData.addressLine_1 === undefined) { isAddressLine_1 = false; setAddressLine_1Error(true); } else { isAddressLine_1 = true; setAddressLine_1Error(false); }

    let isAddressLine_2 = false;
    if (formData.addressLine_2.replace(regex, ' ').trim() === "" || formData.addressLine_2 === undefined) { isAddressLine_2 = false; setAddressLine_2Error(true); } else { isAddressLine_2 = true; setAddressLine_2Error(false); }
   
    let isCountry = false;
    if (formData.country.replace(regex, ' ').trim() === "" || formData.country === "selectCountryDefault" || formData.country === undefined) { isCountry = false; setCountryError(true); } else { isCountry = true; setCountryError(false); }
    
    if (isType && isFirstName && isLastName && isAddressLine_1 && isAddressLine_2 && isCountry) {
      empty = false;
    }


    // Submit if there is no empty input
    if (!empty) {
      
      if (formData.defaultAddress) {
        handleClose();

        let newAddressBook = userData ? [...userData.addressBook] : [...addressBook_guest];
        let newFormData = {...formData};

        let fullName = newFormData.firstName + " " + newFormData.lastName;
        newFormData.fullName = fullName;

        
        let defaultAddress = newAddressBook.filter(address => address.defaultAddress)[0];
        defaultAddress && delete defaultAddress.defaultAddress;
        
        newAddressBook = [newFormData, ...newAddressBook];
        
        if (userData) {
          updateAuth({
            addressBook: newAddressBook
          });
        } else {
          setAddressBook_guest(newAddressBook);
        }
      }
      else {
        handleClose();

        let newAddressBook = userData ? [...userData.addressBook] : [...addressBook_guest];
        let newFormData = {...formData};

        let fullName = newFormData.firstName + " " + newFormData.lastName;
        
        !userData ? addressBook_guest.length > 0 ? delete newFormData.defaultAddress : newFormData.defaultAddress = true : delete newFormData.defaultAddress;

        newFormData.fullName = fullName;
        

        newAddressBook = [...newAddressBook, newFormData];
        
        if (userData) {
          updateAuth({
            addressBook: newAddressBook
          });
        } else {
          setAddressBook_guest(newAddressBook);
        }
      }

      setEmptyInputErrorMessage(false);
    }
    else {
      window.scrollTo(0, 0);
      setEmptyInputErrorMessage(true);
    }

  }


  return (
    <div className="p-addNewAddress">
      <div className="p-addNewAddress--details">
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
          <div className={`${typeError ? "fError" : ""} fColumn`}>
            <label htmlFor="type" className="fInput--select">
              <span>Address Type *</span>
              <select name="type" id="type" value={formData.type} onChange={handleInput}>
                <option value="HOME">HOME</option>
                <option value="WORK">WORK</option>
                <option value="HOTEL">HOTEL</option>
                <option value="VACATION">VACATION HOUSE</option>
                <option value="OTHER">OTHER</option>
              </select>
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
          <div className={`${addressLine_1Error ? "fError" : ""} fColumn`}>
            <label htmlFor="addressLine_1" className="fInput">
              <span>Address Line *</span>
              <input
                type="text"
                name='addressLine_1'
                id="addressLine_1"
                value={formData.addressLine_1}
                onChange={handleInput}
                autoComplete="off"
                spellCheck="false"
              />
            </label>
          </div>
        </div>

        <div className="fRow">
          <div className={`${addressLine_2Error ? "fError" : ""} fColumn`}>
            <label htmlFor="addressLine_2" className="fInput">
              <span>Address Line 2 *</span>
              <input
                type="text"
                name='addressLine_2'
                id="addressLine_2"
                value={formData.addressLine_2}
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

        {
          (userData ? userData.addressBook.length >= 1 : addressBook_guest.length >= 1) &&
          <div className="fRow fCheckbox--left">
            <label htmlFor="defaultAddress">
              <input
                type="checkbox"
                name="defaultAddress"
                id="defaultAddress"
                checked={formData.defaultAddress}
                onChange={handleInput}
              />
              <span>
                Use this address as my default address.
              </span>
            </label>
          </div>
        }


        <div className="p-addNewAddress--buttons fRow fButtons--center">
          <button type='submit' className="buttonS2">Add Address</button>
          <button type='button' className="buttonS1" onClick={handleClose}>Cancel</button>
        </div>
      </form> 
    </div>
  )
}

export default PANEL_ADDNEWADDRESS