// Essentials
import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom';

// Contexts
import { useAuthContext } from '../../contexts/Auth';
import { usePanelContext } from '../../contexts/Panel';

// Hooks
import useTabTitle from "../../hooks/useTabTitle";

// Components
import PANEL_FORGOTPASSWORD from '../../components/panels/auth/Panel_ForgotPassword';

// Styles
import "./Page_Auth.scss";


function PAGE_LOGIN() {

  useTabTitle("Log In");

  const { currentUser: user, signIn, signInError, loading } = useAuthContext();

  // Input States
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: true
  });

  // Input States: Errors
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // Input States: Database Errors
  const [throwError, setThrowError] = useState(null);

  // Input States: Empty Input Errors
  const [emptyInputErrorMessage, setEmptyInputErrorMessage] = useState(false);


  // Handle: Input
  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

    // Set Data
    setFormData({ ...formData, [name]: value })

    // Handle Empty
    if (name === "email") { setEmailError(false); }
    if (name === "password") { setPasswordError(false); }
  }

  // Handle: Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const regex = /\s{2,}/g;

    // Handle Empty Errors
    let empty = true;

    let isEmail = false;
    if (formData.email.replace(regex, ' ').trim() === "" || formData.email === undefined) { isEmail = false; setEmailError(true); } else { isEmail = true; setEmailError(false); }
    
    let isPassword = false;
    if (formData.password.replace(regex, ' ').trim() === "" || formData.password === undefined) { isPassword = false; setPasswordError(true); } else { isPassword = true; setPasswordError(false); }
    

    if (isEmail && isPassword) {
      empty = false;
    }

    // Submit if there is no empty input
    
    // Success
    if (!empty) { 
      signIn(
        formData.email.replace(regex, ' ').trim(), 
        formData.password.replace(regex, ' ').trim(),
        formData.rememberMe ? true : false
      );
      setEmptyInputErrorMessage(false);
    }
    // Error
    else {  
      window.scrollTo(0, 0);
      setEmptyInputErrorMessage(true);
    }
  }

  // Handle Database Errors
  useEffect(() => {
    signInError ? setThrowError(signInError) : setThrowError(null);

    if (signInError) {
      if (signInError.includes("auth/user-not-found")) {
        setThrowError("User not found. Please register if you're not already.")
        setEmailError(true)
        setPasswordError(true)
      }
      else if (signInError.includes("auth/wrong-password")) {
        setThrowError("Invalid password. Remember that password is case-sensitive. Please try again.")
        setPasswordError(true)
        setEmailError(false)
      }
      else {
        setThrowError("Something went wrong.")
      }
    }
  }, [signInError, loading]);

  useEffect(() => {
    window.scroll(0,0);
  }, [signInError]);


  // Handle: Forgot Password
  const { showPanel } = usePanelContext();

  const handleForgotPassword = () => {
    showPanel(<PANEL_FORGOTPASSWORD />, "Forgot Password");
  } 

  return (
    <>
    {
    !loading ?
      !user ?
      <div className="p-auth">
        <h1 className="p-auth--header">
          Log In
        </h1>
        <div className="p-auth--row">
          <div className="p-auth--header--small">
            Returning Customer
          </div>
          <div className="p-auth--details">
            <p>If you are already registered, please log in.</p>
            {
            <p className='fError'>{throwError}</p>
            }
            {
            emptyInputErrorMessage ?
            <p className='fError'>Please enter your email / password. </p>
            :
            ""
            }
          </div>
          <form onSubmit={handleSubmit} className="formS1">
            <div className="fRow">
              <div className={`${emailError ? "fError" : ""} fColumn`}>
                <label htmlFor="email" className="fInput">
                  <span>Email Address</span>
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
                  <span>Password</span>
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

            <div className="fRow fCheckbox--left">
              <div className="fColumn">
                <label htmlFor="rememberMe">
                  <input
                  type="checkbox"
                  name="rememberMe"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInput}
                  />
                  <span>Remember me</span>
                </label>
              </div>
              <div className="fColumn--right">
                <button type='button' onClick={handleForgotPassword} className="linkify">Forgot password?</button>
              </div>
            </div>
            
            <div className="fRow fButtons--center">
              {
                !loading ?
                <button type='submit' className="p-auth--button buttonS2">Sign In</button>
                :
                <button type='button' className="p-auth--button buttonS2" disabled>Please wait...</button>
              }
            </div>
            

            
          </form>
        </div>
        <div className="p-auth--row">
          <div className="p-auth--header--small">
            I'm A New Customer
          </div>
          <div className="p-auth--details">
            Create an account for access to: <br />
            - Orders list. <br />
            - Save your addresses thus faster checkout <br />
            - Save items in your list.
          </div>
          <Link to="/register" className="p-auth--button buttonS1">Register</Link>
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

export default PAGE_LOGIN