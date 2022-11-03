// Essentials
import { useEffect } from 'react';

// Contexts
import { useAuthContext } from '../../../contexts/Auth'

// Style
import "./Panel_Auth.scss";

const PANEL_CHANGEPASSWORD = () => {

    const { currentUserData: userData, passwordReset, authEditResponse, setAuthEditResponse, authEditLoading } = useAuthContext();

    useEffect(() => {
      setAuthEditResponse(0)
  }, []);

  return (
    <div className='panel-changePassword'>
    {
      !authEditLoading ?
      authEditResponse === 0 ? // Idle
    <>
      <p className='idle'>We will send an e-mail to <b>{userData.email}</b> with a link that would allow you to change your password.</p>
      <button className='buttonS2' onClick={passwordReset}>Send Password Reset E-Mail</button>
    </>
    : authEditResponse === 1 ? // Success
    <>
      <p className='success'>Password reset e-mail has been successfully sent to your address <b>{userData.email}</b>. Please check your mailbox.</p>
      <button className='buttonS2' onClick={passwordReset}>Send Again</button>
    </>
    :                  // Error
    <>
      <p className='error'>Oops... There is an error. Please try again.</p>
      <button className='buttonS2' onClick={passwordReset}>Send Again</button>
    </>
    :                  // Loading
      <>
        <span className='loadingS1'/>
        <div className='emptySpace'></div>
      </>
    }
    </div>
  )
}

export default PANEL_CHANGEPASSWORD