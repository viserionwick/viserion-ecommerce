// Essentials
import React from 'react'

// Contexts
import { useAuthContext } from '../../../contexts/Auth';
import { usePanelContext } from '../../../contexts/Panel';

// Hooks
import useTabTitle from '../../../hooks/useTabTitle';

// Panels
import PANEL_EDITPROFILE from '../../../components/panels/auth/Panel_EditProfile/Panel_EditProfile';
import PANEL_CHANGEPASSWORD from '../../../components/panels/auth/Panel_ChangePassword';
import PANEL_MANAGEADDRESSES from '../../../components/panels/auth/Panel_ManageAddresses/Panel_ManageAddresses';



const PAGE_PROFILE = () => {

    useTabTitle("My Profile")

    const { currentUserData: userData, loading } = useAuthContext();
    const { showPanel } = usePanelContext();

    // Edit Profile
    const editProfile = () => {
        showPanel(<PANEL_EDITPROFILE />, "Edit Profile" );
    }

    // Change Password
    const changePassword = () => {
        showPanel(<PANEL_CHANGEPASSWORD />, "Change Password" );
    }

    // Manage Addresses
    const manageAddresses = () => {
        showPanel(<PANEL_MANAGEADDRESSES />, "Manage Addresses" );
    }

  return (
    <>
    {   userData ?
        <section className="p-account">
            <div className="p-account-row">
                <h1>PERSONAL INFO</h1>
                <div>
                    <div>
                        <span>First Name</span>
                        <p>{userData.firstName}</p>
                    </div>
                    <div>
                        <span>Last Name</span>
                        <p>{userData.lastName}</p>
                    </div>
                </div>
                <div>
                    <div>
                        <span>E-Mail Address</span>
                        <p>{userData.email}</p>
                    </div>
                </div>
                <div>
                <button className='buttonS1' onClick={editProfile}>Edit Profile</button>
                <button className='buttonS1' onClick={changePassword}>Change Password</button>
                </div>

            </div>
            <div className="p-account-row">
                <h1>ADDRESS BOOK</h1>
                
                { // Default Address
                userData.addressBook && userData.addressBook
                .filter((address) => address.defaultAddress)
                .map((defaultAddress, i) => (
                <div key={i}>
                    <div>
                        <span>Default Address</span>
                        <p>{defaultAddress.type ? defaultAddress.type:""}</p>
                        <p>{defaultAddress.addressLine_1 ? defaultAddress.addressLine_1:""}</p>
                        <p>{defaultAddress.addressLine_2 ? defaultAddress.addressLine_2:""}</p>
                        <p>{(defaultAddress.city ? defaultAddress.city:"") +" "+ (defaultAddress.postalCode ? defaultAddress.postalCode:"")}</p>
                        <p>{(defaultAddress.firstName ? defaultAddress.firstName:"") +" "+ (defaultAddress.lastName ? defaultAddress.lastName:"")}</p>
                    </div>
                </div>
                ))
                }            
                <button className='buttonS1' onClick={manageAddresses}>Manage Addresses ({userData.addressBook && userData.addressBook.length})</button>
            </div>
        </section>
        :
        <span className='loadingZone'>
            <span className='loadingS1'/>
        </span>
    }
    </>
  )
}

export default PAGE_PROFILE

