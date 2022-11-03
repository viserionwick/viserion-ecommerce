// Essentials
import { useEffect, useState } from "react";

// Contexts
import { useAuthContext } from "../../../../contexts/Auth";
import { usePanelContext } from "../../../../contexts/Panel";

// Components
import PANEL_ADDNEWADDRESS from "./Panel_AddNewAddress";
import PANEL_EDITADDRESS from "./Panel_EditAddress";

// Style
import "./Panel_ManageAddresses.scss"


// Jotai
import { useAtom } from "jotai";
import { atomWithStorage } from 'jotai/utils';

// GLOBAL STATES
export const addressBook_guest_atom = atomWithStorage("addressBook_guest", []);

const PANEL_MANAGEADDRESSES = () => {

    // Contexts
    const { currentUserData: userData, updateAuth } = useAuthContext();
    const { showPanel } = usePanelContext();

    // Address: States
    const [addressBook, setAddressBook] = useState([]);
    const [addressBook_guest, setAddressBook_guest] = useAtom(addressBook_guest_atom);
  
    useEffect(() => {
      userData && setAddressBook(userData.addressBook)
    }, [userData]);

    // Address: Add New Address
    const addNewAddress = () => {
      showPanel(<PANEL_ADDNEWADDRESS />, "Add New Address");
    }
    
    // Address: Make Default
    const makeDefault = (i) => {
      let newAddressBook = userData ? [...addressBook] : [...addressBook_guest];
      
      let defaultAddress = newAddressBook.filter(address => address.defaultAddress)[0];
      delete defaultAddress.defaultAddress;
      
      let element = newAddressBook[i];
      element.defaultAddress = true;
      
      newAddressBook.splice(i, 1);
      newAddressBook.splice(0, 0, element);

      if (userData) {
        setAddressBook(newAddressBook);

        updateAuth({
          addressBook: newAddressBook
        });
      } else {
        setAddressBook_guest(newAddressBook);
      }
    }

    // Address: Remove
    const removeAddress = (i) => {
      let newAddressBook = userData ? [...addressBook] : [...addressBook_guest];

      if (newAddressBook[i].defaultAddress) {
        newAddressBook.splice(i, 1);

        newAddressBook[0].defaultAddress = true;
        
        
        if (userData) {
          setAddressBook(newAddressBook);

          updateAuth({
            addressBook: newAddressBook
          });
        } else {
          setAddressBook_guest(newAddressBook);
        }
      }
      else {
        newAddressBook.splice(i, 1);
        
        if (userData) {
          setAddressBook(newAddressBook);

          updateAuth({
            addressBook: newAddressBook
          });
        } else {
          setAddressBook_guest(newAddressBook);
        }
      }
    }

    // Address: Edit Address
    const editAddress = (i) => {
      showPanel(<PANEL_EDITADDRESS addressIndex={i} />, "Edit Address");
    }

    return (
      <div className="p-manageAddresses">
        <button className="p-manageAddresses__addButton buttonS2" onClick={addNewAddress}>
          Add New Address
        </button>
        <div className="p-manageAddresses__addresses">
          {
            (userData ? addressBook : addressBook_guest) && (userData ? addressBook : addressBook_guest).map((address, i) => (
              <div className="p-manageAddresses__addresses card" key={i}>
                <span className="p-manageAddresses__addresses title">
                  {address.defaultAddress ? <>Default Address</> : <>Address</>}
                </span>
                <div className="p-manageAddresses__addresses address">
                  <p>{address.type ? address.type : ""}</p>
                  <p>{address.fullName ? address.fullName : ""}</p>
                  <p>{address.addressLine_1 ? address.addressLine_1 : ""}</p>
                  <p>{address.addressLine_2 ? address.addressLine_2 : ""}</p>
                  <p>{(address.city ? address.city : "") +" "+ (address.postalCode ? address.postalCode : "")}</p>
                  <p>{address.country ? address.country : ""}</p>
                </div>
                <div className="p-manageAddresses__addresses buttons">
                  <div className="p-manageAddresses__addresses buttons--left">
                    {!address.defaultAddress && <button className="buttonS1" onClick={() => makeDefault(i)}>Make Default</button>}
                  </div>
                  <div className="p-manageAddresses__addresses buttons--right">
                    <button className="buttonS1" onClick={() => editAddress(i)}>Edit</button>
                    {(addressBook.length > 1 || addressBook_guest.length > 1) ? <button className="buttonS1" onClick={() => removeAddress(i)}>Remove</button> : <></>}
                  </div>
                </div>
              </div>
            ))
          }
          {
            (userData ? addressBook : addressBook_guest).length < 1 &&
            <div className="p-manageAddresses__empty">
              No addresses have been added.
            </div>
          }
        </div>
      </div>
    )
  }
  
  export default PANEL_MANAGEADDRESSES