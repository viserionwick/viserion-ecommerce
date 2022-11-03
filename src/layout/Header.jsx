// Essentials
import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from "react-router-dom";

// Contexts
import { usePanelContext } from '../contexts/Panel';

// Hooks
import useFetch from '../hooks/useFetch';
import useScrollEffect from '../hooks/useScrollEffect';

// Styles
import "./Layout.scss";
import "../pages/bag/Page_ShoppingBag.scss";

// Images
import Logo from "../images/Logo.png";


// Jotai
import { atom, useAtom } from 'jotai';

// GLOBAL STATES
import { isAuth_atom } from '../contexts/Auth';
import { shoppingBagList_atom } from '../pages/bag/Page_ShoppingBag';


export const toggleBag_atom = atom(false);

const HEADER = () => {

  let navigate = useNavigate();

  // Auth: Status
  const [isAuth] = useAtom(isAuth_atom);


  // Scroll Effect
  const { styleOnScroll } = useScrollEffect();
  
  const header = useRef();
  
  const onScrollDown = {
    top: "-45px"
  }
  const onScrollUp = {
    top: "0px"
  }

  styleOnScroll(header, onScrollUp, onScrollDown);
  


  // Search
  const searchBoxForm_ref = useRef();
  const searchBoxForm = searchBoxForm_ref.current;

  const searchBoxInput_ref = useRef();
  const searchBoxInput = searchBoxInput_ref.current;

  const [searchBox, setSearchBox] = useState("");
  const [isSearchBoxOpen, setIsSearchBoxOpen] = useState(false);
  
  // Search: Handle & Submit
  const searchBoxHandle = (e) => {
    const { value } = e.target;
    setSearchBox(value);    
  }
  
  const searchBoxSubmit = (e) => {
    e.preventDefault();
    navigate("/search?q="+searchBox);
    setSearchBox("")
    setIsSearchBoxOpen(false);

    
    searchBoxForm.classList.toggle("deleteMe");
    document.body.style.removeProperty("overflow");
  }

  // Search: Toggle
  const toggleSearchBox = (action) => {
    setSearchBox("");

    // Toggle: Auto
    if (action === "") {

      searchBoxForm.classList.toggle("deleteMe");

      if (!searchBoxForm.classList.contains("deleteMe")) {
        setIsSearchBoxOpen(true);
        document.body.style.overflow = "hidden";
  
        searchBoxInput.focus();
      }
      else {
        setIsSearchBoxOpen(false);
        document.body.style.removeProperty("overflow");
      }
    }
    // Toggle: Manual
    else {
      if (action === "open") {
        setIsSearchBoxOpen(true);

        searchBoxForm.classList.remove("deleteMe");
        document.body.style.overflow = "hidden";
        searchBoxInput.focus();
      }
      else if (action === "close") {
        setIsSearchBoxOpen(false);
        
        searchBoxForm.classList.add("deleteMe");
        document.body.style.removeProperty("overflow");
      }
    }
  }
  
  
  // Mobile Menu
  
  const {data: mmData, loading: mmLoading} = useFetch("categories");

  /* mmData && console.log(); */
  const mobileMenu = useRef();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = (action) => {
    // Toggle: Auto
    if (action === "") {
      if (isMenuOpen === false) {
        setIsMenuOpen(true);
        document.body.style.overflow = "hidden";
      }
      else {
        setIsMenuOpen(false);
        document.body.style.removeProperty("overflow");
      }
    } 
    // Toggle: Manual
    else {
      if (action === "open") {
        setIsMenuOpen(true);
        document.body.style.overflow = "hidden";
      }
      else if (action === "close") {
        setIsMenuOpen(false);
        document.body.style.removeProperty("overflow");
      }   
    }
  }

  const dropDownHandler = (e) => {
    const header = e.target.offsetParent;
    
    if (header.classList.contains("opened")) {
      header.classList.remove("opened")
    }
    else {
      header.classList.add("opened")
    }

    // Close others
    const otherHeaders = document.getElementsByClassName("l-header__mobileMenu__content--miniNav--dropdown");

    for (var i = 0; i < otherHeaders.length; i++) {
      const headers = otherHeaders[i];
      const currentHeader = e.target.offsetParent;

      if (headers !== currentHeader) {
        headers.classList.remove("opened");
      }
    }
  }






  // Shopping Bag
  const [shoppingBagList, setShoppingBagList] = useAtom(shoppingBagList_atom);

  const shoppingBag = useRef();
  const [isBagOpen, setIsBagOpen] = useState(false);
  

  const toggleBag = (action) => {
    // Toggle: Auto
    if (action === "") {
      if (isBagOpen === false) {
        setIsBagOpen(true);
        setToggleBag_(true)
        document.body.style.overflow = "hidden";
      }
      else {
        setIsBagOpen(false);
        setToggleBag_(false)
        document.body.style.removeProperty("overflow");
      }
    } 
    // Toggle: Manual
    else {
      if (action === "open") {
        setIsBagOpen(true);
        setToggleBag_(true)
        document.body.style.overflow = "hidden";  
      }
      else if (action === "close") {
        setIsBagOpen(false);
        setToggleBag_(false);
        document.body.style.removeProperty("overflow");
      }   
    }
  }

  const [toggleBag_, setToggleBag_] = useAtom(toggleBag_atom); 
  useEffect(() => {
    toggleBag_ ? toggleBag("open") : toggleBag("close");
  }, [toggleBag_]);

  
  const preOrderDate = (date) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    let oldDate = new Date(date.seconds * 1000);
    let newDate = monthNames[oldDate.getMonth()] +" "+ oldDate.getDate() +", "+ oldDate.getFullYear();

    return (newDate)
  }


// Shopping Bag: Quantity
  const handleQuantity = (event, itemIndex) => {
    if (event === "increase") {
      const newList = [...shoppingBagList];
      if (newList[itemIndex].quantity < newList[itemIndex].maxQuantity){
        newList[itemIndex].quantity += 1;
        setShoppingBagList(newList);
      }else {
        return;
      }
    }
    else if (event === "decrease") {
      const newList = [...shoppingBagList];
      if (newList[itemIndex].quantity > 1){
        newList[itemIndex].quantity -= 1;
        setShoppingBagList(newList);
      }else {
        return;
      }
    }
  }

  // Shopping Bag: Remove Item
  const handleRemove = (productId) => {
    const newList = shoppingBagList.filter((item) => item.productId !== productId)
    setShoppingBagList(newList);
  }
  
  return (
    <>
      {/* Header */}
      <div className="l-header" ref={header}>
        <div className="l-header__row" id="l-header__top">

          <form
            onSubmit={searchBoxSubmit}
            className='searchBoxForm deleteMe formS1'
            ref={searchBoxForm_ref}
          >
            <button type='submit' className='searchSubmitButton'><i className="fa-solid fa-magnifying-glass"></i></button>
            <input
              ref={searchBoxInput_ref}
              type="text"
              name='search'
              id='searchBox'
              className='fInput'
              value={searchBox}
              onChange={searchBoxHandle}
              autoComplete="off"
              spellCheck="false"
            />
            <button type='button' onClick={() => toggleSearchBox("")} className='searchCloseButton'><i className="fa-solid fa-xmark"></i></button>
          </form>

          {/* Left: Desktop */}
          <nav className="l-header__column" id="l-header__top__miniNav">
            <button onClick={() => toggleSearchBox("")} className='l-header__top--bigButtons' id='l-header__top__searchButton'>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            <NavLink to="/women">women</NavLink>
            <NavLink to="/men">men</NavLink>
            <NavLink to="/explore">explore</NavLink>
          </nav>
          {/* Left: Mobile */}
          <nav className="l-header__column mobile" id="l-header__top__miniNav">
            <button className='l-header__top--bigButtons' id='l-header__top__searchButton' onClick={() => toggleMenu("")}>
              <i className="fa-solid fa-bars"></i>
            </button>
          </nav>

          {/* Middle: Desktop */}
          <div className="l-header__column" id="l-header__top__logo">
            <Link to="/" onClick={() => toggleSearchBox("close")}>
              <img src={Logo} alt="logo" />
            </Link>
          </div>
          {/* Middle: Mobile */}
          <div className="l-header__column mobile" id="l-header__top__logo">
            <Link to="/">
              <img src={Logo} alt="logo" />
            </Link>
          </div>
          
          {/* Right: Desktop */}
          <div className="l-header__column" id="l-header__top__profile">
            <NavLink to="/faq" onClick={() => toggleSearchBox("close")}>client service</NavLink>
            {
              isAuth ?
              <NavLink to="/account" onClick={() => toggleSearchBox("close")}>My Account</NavLink>
              :
              <NavLink to="/login" onClick={() => toggleSearchBox("close")}>Log In</NavLink>
            }
            <button className='l-header__top--bigButtons' id='l-header__top__shoppingBagButton' onClick={() => {toggleSearchBox("close"); toggleBag("");}}>
              <i className="fa-solid fa-bag-shopping" />
            { 
              shoppingBagList.length !== 0 &&
              <span id='shoppingBagItemCount'>{ shoppingBagList.length }</span>
            }
            </button>
          </div>
          {/* Right: Mobile */}
          <div className="l-header__column mobile" id="l-header__top__profile">
            <button onClick={() => toggleSearchBox("")} className='l-header__top--bigButtons' id='l-header__top__searchButton'>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            <button className='l-header__top--bigButtons' id='l-header__top__shoppingBagButton' onClick={() => toggleBag("")}>
              <i className="fa-solid fa-bag-shopping" />
            { 
              shoppingBagList.length !== 0 &&
              <span id='shoppingBagItemCount'>{ shoppingBagList.length }</span>
            }
            </button>
          </div>

        </div>
      </div>


    {/* Mobile Menu */}
      <div className={isMenuOpen ? "l-header__mobileMenu" : "l-header__mobileMenu deleteMe"} ref={mobileMenu}>
        <div className="l-header__mobileMenu--header">
          <button onClick={() => toggleMenu("")} className="buttonClear"><i className="fa-solid fa-xmark"></i></button>
          <span>Menu</span>
        </div>
        <div className="l-header__mobileMenu__content">
          {
            !mmLoading ?
            <>
            <ul className='l-header__mobileMenu__content--miniNav'>
              <li><NavLink end to="/" onClick={() => toggleMenu("")}>New Arrivals</NavLink></li>
              <li className='l-header__mobileMenu__content--miniNav--dropdown'>
                <span>
                  <NavLink to="/women" onClick={() => toggleMenu("close")}>Women</NavLink>
                  <button onClick={dropDownHandler}><i className="fa-solid fa-chevron-down"></i></button>
                </span>
                <ul>
                {
                    mmData.filter(gender => gender.id == "women")[0].subCategories.map((sub, i) => (
                      <li key={i}><NavLink end={i === 0} to={sub.url} onClick={() => toggleMenu("close")}>{sub.title}</NavLink></li>
                    ))
                  }
                </ul>
              </li>
              <li className='l-header__mobileMenu__content--miniNav--dropdown'>
                <span>
                  <NavLink to="/men" onClick={() => toggleMenu("close")}>Men</NavLink> 
                  <button onClick={dropDownHandler}><i className="fa-solid fa-chevron-down"></i></button>
                </span>
                <ul>
                  {
                    mmData.filter(gender => gender.id == "men")[0].subCategories.map((sub, i) => (
                      <li key={i}><NavLink end={i === 0} to={sub.url} onClick={() => toggleMenu("close")}>{sub.title}</NavLink></li>
                    ))
                  }
                </ul>
              </li>
              <li><NavLink to="/explore" onClick={() => toggleMenu("close")}>Explore</NavLink></li>
            </ul>
            <ul className='l-header__mobileMenu__content--profile'>
              <li>
              {
                isAuth ?
                <NavLink to="/account" onClick={() => toggleMenu("close")}>My Account</NavLink>
                :
                <NavLink to="/login" onClick={() => toggleMenu("close")}>Log In</NavLink>
              }
              </li>
              <li><NavLink to="/faq" onClick={() => toggleMenu("close")}>client service</NavLink></li>
            </ul>
            </>
            :
            <div className='loadingZone'>
              <span className='loadingS1'/>
            </div>
          }
        </div>

      </div>


    {/* Shopping Bag */}
      <div className={isBagOpen ? "l-header__shoppingBag" : "l-header__shoppingBag deleteMe"} ref={shoppingBag}>
        <div className="l-header__shoppingBag--header">
          <span>Shopping Bag</span>
          <button onClick={() => toggleBag("")} className="buttonClear"><i className="fa-solid fa-xmark"></i></button>
          
        </div>
        <div className="l-header__shoppingBag__list">
          { shoppingBagList.length === 0 ? 
            <div className='l-header__shoppingBag__list--empty'>
              <h1>Your shopping bag is empty</h1> 
              <button type='button' className='buttonS1' onClick={() => { toggleBag("close"); }}>Continue Shopping</button>
            </div>
            :
            shoppingBagList.map((item, itemIndex) => (
              <div className="l-header__shoppingBag__list--item" key={itemIndex}>
                <Link to={`/product/${item.url}`} className="l-header__shoppingBag__list--item__picture buttonClear" onClick={() => { toggleBag("close"); }}>
                  <img src={item.image} alt="item_image" />
                </Link>
                <div className="l-header__shoppingBag__list--item--details">

                  {/* Title & Price */}
                  <div className="l-header__shoppingBag__list--item--details--titleAndPrice">
                    <Link to={`/product/${item.url}`} className='l-header__shoppingBag__list--item--details__title buttonClear' onClick={() => { toggleBag("close"); }}>
                      {item.title}
                    </Link>
                    <div className="l-header__shoppingBag__list--item--details__totalPrice">
                      {"$ " + item.basePrice * item.quantity}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="l-header__shoppingBag__list--item--details--features">
                    <div className="l-header__shoppingBag__list--item--details--features__color">
                      <div>Color:</div>
                      <div>
                        <span style={{background: item.color}} />
                      </div>
                    </div>
                    <div className="l-header__shoppingBag__list--item--details--features__size">
                      <div>Size:</div>
                      <div>
                        <span>{item.size}</span>
                      </div>
                    </div>
                    <div className="l-header__shoppingBag__list--item--details--features__quantity">
                      <div>Quantity:</div>
                      <div>
                        <div className="l-header__shoppingBag__list--item--details--features__quantity--control">
                          <button onClick={() => handleQuantity("decrease", itemIndex)} className='buttonS3--clear'><i className="fa-solid fa-minus"></i></button>
                            <span>{item.quantity}</span>
                          <button onClick={() => handleQuantity("increase", itemIndex)} className='buttonS3--clear'><i className="fa-solid fa-plus"></i></button>
                        </div>
                        {
                          item.quantity >= item.maxQuantity ?
                            <div>
                              <p className='l-header__shoppingBag__list--item--details__row--amount--error'>Limit reached.</p>
                            </div>
                            :
                            null
                        }
                      </div>
                    </div>
                  </div>

                  {/* Buttons & Pre-Order Info */}
                  <div className="l-header__shoppingBag__list--item--details--buttonsAndInfo">
                    <div className="l-header__shoppingBag__list--item--details__preOrderDate">
                    {
                      item.status === 2 ?
                      <>
                      PRE-ORDER (Available on: {preOrderDate(item.preOrderDate)})
                      </>
                      :
                      null
                    }
                    </div>
                    
                    <div className="l-header__shoppingBag__list--item--details__buttons">
                      <button className='l-header__shoppingBag__list--item--details__removeButton buttonS1' onClick={() => handleRemove(item.productId)}>REMOVE</button>
                    </div>
                  </div>
                  
                </div>
              
              </div>
            ))
          }
        </div>
        <div className="l-header__shoppingBag__afterMath">
          { shoppingBagList.length === 0 ?
            <></>
            :
            <>
            <Link to="/checkout" onClick={() => toggleBag("close")} className='buttonS2' id='l-header__shoppingBag__afterMath__checkoutButton'>Proceed to Checkout</Link>
            <Link to="/bag" onClick={() => toggleBag("close")} className='buttonS1' id='l-header__shoppingBag__afterMath__viewButton'>View Shopping Bag</Link>
            </>
          }
        </div>

      </div>

      
      {isBagOpen || isMenuOpen ? 
      <span id="l-header__panelBackground" onClick={() => {toggleBag("close"); toggleMenu("close")}} />
      :
      <></>
      }

      {
        isSearchBoxOpen && 
        <span id="l-header__panelBackground--forSearch" onClick={() => toggleSearchBox("close")} />
      }

    </>
  )
}

export default HEADER