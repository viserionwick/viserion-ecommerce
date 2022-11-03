// Essentials
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

// Hooks
import useScrollEffect from "../../hooks/useScrollEffect";

// Style
import "./TabMenu.scss";

const TABMENU = ({title = null, links, element = null, loading}) => {

  // Get Exact Location
  const { pathname, search } = useLocation();
  let path = pathname+search;

  // Layout
  const contentWrapper = useRef();
  const contentScroller = useRef();
  const contentChild = useRef();

  // Scroll
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    if (contentWrapper.current && contentChild.current) {
      let childrenWidth = 0;
      
      for (let i = 0; i < contentChild.current.childNodes.length; i++) {
        const child = contentChild.current.childNodes[i];
        const style = getComputedStyle(child);
        
        childrenWidth = childrenWidth + (child.offsetWidth + parseInt(style.marginLeft) + parseInt(style.marginRight) + parseInt(style.marginTop) + parseInt(style.marginBottom));
      }

      const updateSize = () => {
        let currentWidth = contentWrapper.current.clientWidth;

        if (childrenWidth > currentWidth) {
          setScrollable(true);
        }
        else {
          setScrollable(false);
        }
      }

      updateSize();
      window.addEventListener('resize', updateSize);
      

      return () => window.removeEventListener('resize', updateSize);
    }
  }, [contentWrapper.current, contentChild.current, links, element]);

  


  // Scroll: Button States
  const [goLeft, setGoLeft] = useState(false);
  const [goRight, setGoRight] = useState(false);

  if (scrollable) {

    contentScroller.current.onscroll = () => {
      let position = contentScroller.current.scrollLeft;
      let max = contentScroller.current.scrollWidth - contentScroller.current.clientWidth;

      if (position < 1) { // Limit of Left
        setGoLeft(false);
        setGoRight(true);
        contentScroller.current.scrollLeft = 0;
      }
      else if (position >= max) { // Limit of Right
        setGoLeft(true);
        setGoRight(false);
        contentScroller.current.scrollLeft = max;
      }
      else {
        setGoLeft(true);
        setGoRight(true);
      }
    }
    
  }

  // Scroll: Button Functions
  const scrollJump = 200;
  const onLeft = () => {
    contentScroller.current.scrollLeft -= scrollJump;
  }
  const onRight = () => {
    contentScroller.current.scrollLeft += scrollJump;
  }


  // Scroll: Initial Position
  useEffect(() => {
    if (scrollable) {
      let position = contentScroller.current.scrollLeft;
      let max = contentScroller.current.scrollWidth - contentScroller.current.clientWidth;

      if (position < 1) { // Limit of Left
        setGoLeft(false);
        setGoRight(true);
      }
      else if (position === max) { // Limit of Right
        setGoLeft(true);
        setGoRight(false);
      }
      else {
        setGoLeft(true);
        setGoRight(true);
      }
    }
  }, [scrollable]);

  // Harmonize with the Header
  const { styleOnScroll } = useScrollEffect();

  const tabMenu = useRef();

  const onScrollDown = {
    top: "5px"
  }
  const onScrollUp = {
    top: "50px"
  }
  
  styleOnScroll(tabMenu, onScrollUp, onScrollDown);
  
  

  return (
    <div className="tabMenu" ref={tabMenu}>
      {
        loading ?
        <div className="tabMenu__menu--loading">
          <div className="skeleton title" />
          <div className="skeleton links" />
        </div>
        :
        <>
          { title ? <h1 className="tabMenu__title">{ title }</h1> : "" }
          <div className='tabMenu__menu--wrapper' ref={contentWrapper}>
            { !element ? <button className={`tabMenu__menu--goLeft ${!goLeft ? "deleteMe" : ""}`} onClick={onLeft}><i className="fa-solid fa-chevron-left"></i></button> : "" }
            <div className="tabMenu__menu--content" ref={contentScroller}>
              <nav className="tabMenu__menu" style={{justifyContent: !scrollable ? "center" : ""}} ref={contentChild}>
                {
                  !element ?
                  links && links.map(( link, i ) => (
                    !link.onclick ?
                    <NavLink end={ i === 0 } className={() => path === link.url ? "active" : ""} to={ link.url } key={ i }>{ link.title }</NavLink>
                    :
                    <button onClick={ link.onclick } key={ i } className="tabMenu__menu--linkButtons">{ link.title }</button>
                  ))
                  :
                  element
                }
              </nav>
            </div>
            { !element ? <button className={`tabMenu__menu--goRight ${!goRight ? "deleteMe" : ""}`} onClick={onRight}><i className="fa-solid fa-chevron-right"></i></button> : "" }
          </div>
        </>
      }
    </div>
  )
}

export default TABMENU