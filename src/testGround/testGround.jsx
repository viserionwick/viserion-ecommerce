// Essentials
import { useEffect, useState } from 'react';

// Firebase
import { analytics } from '../firebase/Config';
import { logEvent } from 'firebase/analytics';

// Hooks
import useCookieConsent from '../hooks/useCookieConsent/useCookieConsent';

// Style
import "./testGround.scss"


const TESTGROUND = () => {

  const { isCookieConsented } = useCookieConsent();

    useEffect(() => {
        logEvent(analytics, 'testing', { test: 'yeah'});
    }, []);

    const testing = () => {
      logEvent(analytics, 'testing', { test: 'yeah'});
    }

    useEffect(() => {
      console.log("testGround.js cookie consent: ", isCookieConsented);
    }, [isCookieConsented]);

  return (
    <div className='testGround'>
      <button onClick={testing}>test</button>
    </div>
  )
}

export default TESTGROUND