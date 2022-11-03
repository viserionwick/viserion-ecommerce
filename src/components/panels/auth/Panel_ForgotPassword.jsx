// Essentials
import { useEffect, useState } from 'react';

// Contexts
import { useAuthContext } from '../../../contexts/Auth'

// Style
import "./Panel_Auth.scss";

const PANEL_FORGOTPASSWORD = () => {

    const { forgotPassword, authEditResponse, setAuthEditResponse, authEditLoading } = useAuthContext();

    useEffect(() => {
        setAuthEditResponse(0);
        
    }, []);


    // State
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);

    // Handle: Input
    const handleEmail = (e) => {
        const { name, value } = e.target;
        setEmail(value);

        if (name === "email") { setEmailError(false) };
    }

    // Handle: Submit
    const handleSubmit = (e) => {
        e.preventDefault();
        const regex = /\s{2,}/g;

        let isEmail = false;
        if (email.replace(regex, ' ').trim() === "" || email === undefined) {
            isEmail = false;
            setEmailError(true);
        }
        else {
            isEmail = true;
            setEmailError(false);
        }

        if (isEmail) {
            console.log("success");
            forgotPassword(email);
        }
        else { 
            console.log("error");
        }
    }

  return (
    <div className='panel-forgotPassword'>
    {
    !authEditLoading ?
    authEditResponse === 0 ? // Idle

    <form onSubmit={handleSubmit} className='idle formS1'>
        <label htmlFor="email" className={`fInput ${emailError && "fError"}`}>
            <span>E-Mail</span>
            <input
                type="text"
                id='email'
                name='email'
                value={email}
                onChange={handleEmail}
            />
        </label>
        <button className='buttonS2'>Send</button>
        <p>We will send an <b>e-mail</b> to the address that you provide with a link that would allow you to change your password.</p>
    </form>

    : authEditResponse === 1 ? // Success
    <div className='success'>
        <p>Password reset e-mail has been successfully sent to your address <b>{email}</b>. Please check your mailbox.</p>
        <button className='buttonS2' onClick={handleSubmit}>Send Again</button>
    </div>
    : // Error
    <form onSubmit={handleSubmit} className='error formS1'>
        <label htmlFor="email" className={`fInput ${emailError && "fError"}`}>
            <span>E-Mail</span>
            <input
                type="text"
                id='email'
                name='email'
                value={email}
                onChange={handleEmail}
            />
        </label>
        <button className='buttonS2' onClick={handleSubmit}>Send Again</button>
        <p>E-Mail address <b>might not</b> be registered or there is a <b>typo / misspell</b>.  Please try again.</p>
    </form>
    : // Loading
      <>
        <span className='loadingS1'/>
        <div className='emptySpace'></div>
      </>
    }
    </div>
  )
}

export default PANEL_FORGOTPASSWORD