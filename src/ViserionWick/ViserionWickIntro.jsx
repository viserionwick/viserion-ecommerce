// Essentials
import { useEffect, useState } from "react";

// Hooks
import useLocalStorage from "../hooks/useLocalStorage";

// Images
import ViserionWickLogo from "./ViserionWickLogo.png";

// Style
import "./ViserionWickIntro.scss";

const VISERIONWICKINTRO = () => {

  const { storedData: blockScreen, dispatch } = useLocalStorage("viserionWickIntro");

  console.log(blockScreen);
  
  useEffect(() => {
      // Lock Scroll
      document.body.style.overflow = "hidden";

      // Block
      if (!localStorage.getItem("viserionWickIntro")) {
        localStorage.setItem("viserionWickIntro", true);
      }
  }, []);


  const onAccept = () => {
    localStorage.setItem("viserionWickIntro", false);
    dispatch();
  }

  return (
    <>
    {
      blockScreen === "true" || blockScreen === null  ?
      <div className="viserionWickIntro">
        <div className="container">
          <a href="https://www.viserionwick.com" target="_blank" id="logo"><img src={ViserionWickLogo} alt="ViserionWickLogo"/></a>
          <h1>This website is made for recruitment purposes only and is a mock-up of an existing registered company Balenciaga and they are not involved in this whatsoever.</h1>
          <h3>Your information that you provide and give permission to will be stored in our database except for your credit card information.</h3>
          <button type="button" onClick={onAccept}>OK, I UNDERSTAND.</button>
        </div>
      </div>
      : <></>
    }
    </>
  )
}

export default VISERIONWICKINTRO