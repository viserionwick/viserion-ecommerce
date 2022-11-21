// Essentials
import { useEffect } from 'react';

// Firebase
import { analytics } from '../firebase/Config';
import { logEvent } from 'firebase/analytics';

// Style
import "./testGround.scss"


const TESTGROUND = () => {

    useEffect(() => {
        logEvent(analytics, 'testing', { test: 'yeah'});
    }, []);

    const testing = () => {
      logEvent(analytics, 'testing', { test: 'yeah'});
    }

  return (
    <div className='testGround'>
      <button onClick={testing}>test</button>
    </div>
  )
}

export default TESTGROUND