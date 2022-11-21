// Essentials
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Contexts
import { useAuthContext } from "../../contexts/Auth";
import { usePanelContext } from "../../contexts/Panel";

// Hooks
import useTabTitle from "../../hooks/useTabTitle";
import useCouponCode from "../../hooks/useCouponCode";
import useEstimate from "../../hooks/useEstimate";
import usePlaceOrder from "../../hooks/usePlaceOrder";

// Panels
import PANEL_MANAGEADDRESSES from "../../components/panels/auth/Panel_ManageAddresses/Panel_ManageAddresses";
import PANEL_ADDNEWADDRESS from "../../components/panels/auth/Panel_ManageAddresses/Panel_AddNewAddress";

// Style
import "./Page_Checkout.scss";

// Jotai
import { useAtom } from "jotai";

// GLOBAL STATES
import { shoppingBagList_atom } from "../bag/Page_ShoppingBag";
import { addressBook_guest_atom } from "../../components/panels/auth/Panel_ManageAddresses/Panel_ManageAddresses";

const PAGE_CHECKOUT = () => {

    const navigate = useNavigate();

    useTabTitle("Checkout");

    // Contexts
    const { currentUserData: userData } = useAuthContext();
    const { showPanel } = usePanelContext();

    // States
    const [checkoutList] = useAtom(shoppingBagList_atom);
    const [addressList] = useAtom(addressBook_guest_atom);
    const [addresses, setAddresses] = useState();
    const [uploading, setUploading] = useState(false);


    useEffect(() => {
      if (userData) {
        setAddresses(userData.addressBook)
      } else {
        setAddresses(addressList);
      }
    }, [userData, addressList]);


    useEffect(() => {
      checkoutList && checkoutList.length < 1 && navigate("/bag");
    }, [checkoutList]);


    const preOrderDate_toDate = (date) => {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
      let oldDate = new Date(date.seconds * 1000);
      let newDate = monthNames[oldDate.getMonth()] +" "+ oldDate.getDate() +", "+ oldDate.getFullYear();
  
      return (newDate)
    }


    // Input States
    const [formData, setFormData] = useState({
      products: checkoutList,
      totalPrice: 0,
      shippingTo: "",
      billingTo: "",
      email: userData ? userData.email : "",
      phoneNumber: "",
      cardNumber: "",
      expMonth: "",
      expYear: "",
      cvv: ""
    });
    
    useEffect(() => {
      userData && setFormData({...formData, ["email"]: userData.email})
    }, [userData]);
    useEffect(() => {
      checkoutList && setFormData({...formData, ["products"]: checkoutList})
    }, [checkoutList]);

    const [sameAsShipping, setSameAsShipping] = useState(true);

    useEffect(() => {
      if (addresses) {
        if (addresses.length <= 0) {
          setFormData({ ...formData, ["shippingTo"]: "default", ["billingTo"] : "default"});
        } else {
          let defaultAddress = [...addresses.filter(address => address.defaultAddress)][0];
          if (defaultAddress) {
            defaultAddress = 0;
            setFormData({ ...formData, ["shippingTo"]: defaultAddress, ["billingTo"] : defaultAddress});
          }
        }
      }
    }, [addresses]);

    useEffect(() => {
      if (sameAsShipping) {
        setFormData({ ...formData, ["shippingTo"]: formData.shippingTo, ["billingTo"] : formData.shippingTo });
      }
    }, [sameAsShipping, formData.shippingTo]);


  // Coupon Code 
  const {
    /* STATES */
    couponCode,
    couponCode_global,
    couponCodeSnapshot,
    couponCodePersentage,
    couponCodeResult,
    couponCodeError,

    /* FETCH STATES*/
    ccLoadingFetch,
    
    /* FUNCTIONS */
    couponCodeSubmit,
    couponCodeHandler,
    couponCodeRemove
  } = useCouponCode();

  // Estimate
  const { estimatedTotal, couponCodeExtracted } = useEstimate(checkoutList, couponCodePersentage);

  // Input States: Errors 
  const [shippingToError, setShippingToError] = useState("");
  const [billingToError, setBillingToError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [cardNumberError, setCardNumberError] = useState(false);
  const [expMonthError, setExpMonthError] = useState(false);
  const [expYearError, setExpYearError] = useState(false);
  const [cvvError, setCvvError] = useState(false);

  // Handle: Input
  const handleInput = (e) => {
    const { name, value } = e.target;

    if (name === "billingTo") {
      if (sameAsShipping) {
        setSameAsShipping(false);
        setFormData({ ...formData, [name]: value });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }


    // Handle Empty
    if (sameAsShipping) {
      if (name === "shippingTo") { setShippingToError(false); setBillingToError(false); }
    } else {
      if (name === "shippingTo") { setShippingToError(false); }
      if (name === "billingTo") { setBillingToError(false); }
    }
    if (name === "email") { setEmailError(false); }
    if (name === "cardNumber") { setCardNumberError(false); }
    if (name === "expMonth") { setExpMonthError(false); }
    if (name === "expYear") { setExpYearError(false); }
    if (name === "cvv") { setCvvError(false); }

  }

  const handleManageAddresses = () => {
    showPanel(<PANEL_MANAGEADDRESSES />, "Manage Addresses");
    setFormData({ ...formData, ["shippingTo"]: "default", ["billingTo"] : "default"});
  }
  const handleAddNewAddress = () => {
    showPanel(<PANEL_ADDNEWADDRESS />, "Add New Address");
  }



  const { placeOrder } = usePlaceOrder();

  const handleSubmit = (e) => {
    e.preventDefault();
    const regex = /\s{2,}/g;

    // Handle Loading
    setUploading(true);

    // Handle Empty Errors
    let empty = true;

    let isShippingTo = false;
    if ( formData.shippingTo === "default" || formData.shippingTo === undefined) { isShippingTo = false; setShippingToError(true); } else { isShippingTo = true; setShippingToError(false); }

    let isBillingTo = false;
    if ( formData.billingTo === "default" || formData.billingTo === undefined) { isBillingTo = false; setBillingToError(true); } else { isBillingTo = true; setBillingToError(false); }
    
    let isEmail = false;
    if (formData.email.replace(regex, ' ').trim() === "" || formData.email === undefined) { isEmail = false; setEmailError(true); } else { isEmail = true; setEmailError(false); }

    let isPhoneNumber = false;
    if (formData.phoneNumber.replace(regex, ' ').trim() === "" || formData.phoneNumber === undefined) { isPhoneNumber = false; setPhoneNumberError(true); } else { isPhoneNumber = true; setPhoneNumberError(false); }

    let isCardNumber = false;
    if (formData.cardNumber.replace(regex, ' ').trim() === "" || formData.cardNumber === undefined) { isCardNumber = false; setCardNumberError(true); } else { isCardNumber = true; setCardNumberError(false); }
    
    let isExpMonth = false;
    if (formData.expMonth.replace(regex, ' ').trim() === "" || formData.expMonth === undefined) { isExpMonth = false; setExpMonthError(true); } else { isExpMonth = true; setExpMonthError(false); }
    
    let isExpYear = false;
    if (formData.expYear.replace(regex, ' ').trim() === "" || formData.expYear === undefined) { isExpYear = false; setExpYearError(true); } else { isExpYear = true; setExpYearError(false); }
    
    let isCvv = false;
    if (formData.cvv.replace(regex, ' ').trim() === "" || formData.cvv === undefined) { isCvv = false; setCvvError(true); } else { isCvv = true; setCvvError(false); }

    if (isShippingTo && isBillingTo && isEmail && isPhoneNumber && isCardNumber && isExpMonth && isExpYear && isCvv) {
      empty = false;
    }

    // Submit if there is no empty input
    if (!empty) {
      
      let products = [];

      formData.products.map((item) => {
        const newItem = {
          productId: item.productId,
          status: item.status,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          basePrice: item.basePrice,
          image: item.image,
          title: item.title,
          url: item.url,
        }

        if (item.preOrderDate) {
          newItem.preOrderDate = item.preOrderDate;
        }

        products = [...products, newItem];
      });

      let userId = userData ? userData.userId : null;
      let email = formData.email.replace(regex, ' ').trim();
      let phoneNumber = formData.phoneNumber.replace(regex, ' ').trim();
      let shippingTo = addresses[formData.shippingTo];
      let billingTo = addresses[formData.billingTo];
      let couponCode = couponCode_global ? couponCode_global : null;


      placeOrder(new Date(), products, estimatedTotal, couponCode, shippingTo, billingTo, email, phoneNumber, userId);
      couponCodeRemove();

      // Handle Loading
      setUploading(true);

    } else { 
      window.scrollTo(0, 0);

      // Handle Loading
      setUploading(false);
    }
  }

  return (
    <div className="p-checkout">
      <h1 className="p-checkout--header">
        Checkout
      </h1>
      <div className="p-checkout__preview">
        <div className="p-checkout__preview__list">
          {
            checkoutList.map((item, itemIndex) => (
            <div className="p-checkout__preview__list--item" key={itemIndex}>
              <Link to={`/product/${item.url}`} className="p-checkout__preview__list--item__picture buttonClear">
                <img src={item.image} alt="item_image" />
              </Link>
              <div className="p-checkout__preview__list--item--details">

                {/* Title & Price */}
                <div className="p-checkout__preview__list--item--details--titleAndPrice">
                  <Link to={`/product/${item.url}`} className='p-checkout__preview__list--item--details__title buttonClear'>
                    {item.title}
                  </Link>
                  <div className="p-checkout__preview__list--item--details__totalPrice">
                    {"$ " + (item.basePrice * item.quantity).toFixed(2).replace(/[.,]00$/, "")}
                  </div>
                </div>

                {/* Details */}
                <div className="p-checkout__preview__list--item--details--features">
                  <div className="p-checkout__preview__list--item--details--features__color">
                    <div>Color:</div>
                    <div>
                      <span style={{background: item.color}} />
                    </div>
                  </div>
                  <div className="p-checkout__preview__list--item--details--features__size">
                    <div>Size:</div>
                    <div>
                      <span>{item.size}</span>
                    </div>
                  </div>
                  <div className="p-checkout__preview__list--item--details--features__quantity">
                    <div>Quantity:</div>
                    <div>
                      <span>{item.quantity}</span>
                    </div>
                  </div>
                </div>

                {/* Buttons & Pre-Order Info */}
                <div className="p-checkout__preview__list--item--details--buttonsAndInfo">
                  <div className="p-checkout__preview__list--item--details__preOrderDate">
                  {
                    item.status === 2 ?
                    <>
                    PRE-ORDER (Available on: {preOrderDate_toDate(item.preOrderDate)})
                    </>
                    :
                    null
                  }
                  </div>
                </div>
              </div>
            </div>
            ))
          }
        </div>
      </div>
      <div className="p-checkout__info">
        <div className="p-checkout__info--addresses formS1">
          <div>
            <div className={`${shippingToError ? "fError" : ""} p-checkout__info--shippingTo`}>
              <h1>Shipping To*</h1>
              <select className="fInput" name="shippingTo" id="shippingTo"  value={formData.shippingTo} onChange={handleInput}>
                <option value="default"> Select Shipping Address </option>
                {
                  addresses && addresses.map((address, i) => (
                    address.addressLine_1 &&
                    <option value={i} key={i}>
                      {
                        address.type 
                        +" "+
                        address.addressLine_1
                        +" "+
                        address.addressLine_2
                      }
                    </option>
                  ))
                }
              </select>
            </div>
            <div className={`${billingToError ? "fError" : ""} p-checkout__info--billingTo`}>
              <h1>
                <span>Billing To*</span>
                <label htmlFor="sameAsShipping">
                  <span>Same As Shipping Address</span>
                  <input
                  type="checkbox"
                  name="sameAsShipping"
                  id="sameAsShipping"
                  checked={sameAsShipping}
                  onChange={() => setSameAsShipping(!sameAsShipping)}
                  />
                </label>
              </h1>
              <select className="fInput" name="billingTo" id="billingTo" value={formData.billingTo} onChange={handleInput}>
                <option value="default"> Select Billing Address </option>
                {
                  addresses && addresses.map((address, i) => (
                    address.addressLine_1 &&
                    <option value={i} key={i}>
                      {
                        address.type 
                        +" "+
                        address.addressLine_1
                        +" "+
                        address.addressLine_2
                      }
                    </option>
                  ))
                }
              </select>
            </div>
          </div>
          {
            addresses && addresses.length >= 1 ?
            <button className="buttonS1" type="button" onClick={handleManageAddresses}>Manage Addresses</button>
            :
            <button className="buttonS2" type="button" onClick={handleAddNewAddress}>Add New Address</button>
          }
          
          {
            !userData &&
            <div className={`${emailError ? "fError" : ""} p-checkout__info--email`}>
              <h1>E-Mail To*</h1>
              <input
                type="email"
                name='email'
                id="email"
                className="fInput"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleInput}
                autoComplete="off"
                spellCheck="false"
              />
            </div>
          }
          <div className={`${phoneNumberError ? "fError" : ""} p-checkout__info--email`}>
            <h1>Phone Number*</h1>
            <input
              type="text"
              name='phoneNumber'
              id="phoneNumber"
              className="fInput"
              placeholder="+1 234 567 8910"
              value={formData.phoneNumber}
              onChange={handleInput}
              autoComplete="off"
              spellCheck="false"
            />
          </div>
        </div>
        
        <div className="p-checkout__info--afterMath">
          <form onSubmit={couponCodeSubmit} className="p-checkout__info--afterMath__coupon formS1">
            <div>
              <input
                type="text"
                placeholder='Coupon Code'
                className={`fInput ${couponCodeError ? "fError" : ""}`}
                name="couponCode"
                id="couponCode"
                value={couponCode}
                onChange={couponCodeHandler}
              />
              <button className='buttonS2' disabled={couponCode === "" || ccLoadingFetch}>
                {
                  !ccLoadingFetch ?
                  "Apply"
                  :
                  "Loading" 
                }
              </button>
            </div>
            
            { couponCodeResult }
            
          </form>
          <div className="p-checkout__info--afterMath__total">
            <div className="p-checkout__info--afterMath__total--line">
              <h4>Shipping Cost</h4>
              <p>$ 0.00</p>
            </div>
            <div className="p-checkout__info--afterMath__total--line">
              <h4>Sales Tax</h4>
              <p>$ 0.00</p>
            </div>
            {
              couponCodePersentage ?
              <div className="p-checkout__info--afterMath__total--line">
                <h4><button className='buttonS1' onClick={couponCodeRemove}>Remove</button>Coupon: {couponCodeSnapshot} (-{couponCodePersentage}%)</h4>
                <p>- $ {couponCodeExtracted && couponCodeExtracted.toFixed(2).replace(/[.,]00$/, "")}</p>
              </div>
              : ""
            }
            <div className="p-checkout__info--afterMath__total--line total">
              <h4>Estimated Total</h4>
              <p>$ {estimatedTotal && estimatedTotal}</p>
            </div>
          </div>
        </div>
        <div className="p-checkout__info--payment formS1">
          <h1>Payment</h1>
          <span>* Required (do NOT enter any actual information here. This website is for mock up purposes only)</span>

          <div className="fRow">
            <div className={`${cardNumberError ? "fError" : ""} fColumn`}>
              <label htmlFor="cardNumber" className="fInput">
                <span>Card Number *</span>
                <input
                  type="text"
                  name='cardNumber'
                  id="cardNumber"
                  autoComplete="off"
                  spellCheck="false"
                  value={formData.cardNumber}
                  onChange={handleInput}
                />
              </label>
            </div>
          </div>

          <div className="fRow">
            <div className={`${expMonthError ? "fError" : ""} fColumn`}>
              <label htmlFor="expMonth" className="fInput">
                <span>Exp. Month *</span>
                <input
                  type="text"
                  name='expMonth'
                  id="expMonth"
                  autoComplete="off"
                  spellCheck="false"
                  value={formData.expMonth}
                  onChange={handleInput}
                />
              </label>
            </div>
            
            <div className={`${expYearError ? "fError" : ""} fColumn`}>
              <label htmlFor="expYear" className="fInput">
                <span>Exp. Year *</span>
                <input
                  type="text"
                  name='expYear'
                  id="expYear"
                  autoComplete="off"
                  spellCheck="false"
                  value={formData.expYear}
                  onChange={handleInput}
                />
              </label>
            </div>

            <div className={`${cvvError ? "fError" : ""} fColumn`}>
              <label htmlFor="cvv" className="fInput">
                <span>CVV *</span>
                <input
                  type="text"
                  name='cvv'
                  id="cvv"
                  autoComplete="off"
                  spellCheck="false"
                  value={formData.cvv}
                  onChange={handleInput}
                />
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {
              !uploading ?
              <button className="p-checkout__info--submit buttonS2" type="submit">Place Order</button>
              :
              <button className="p-checkout__info--submit buttonS2" type="submit" disabled>Please wait...</button>
            }
          </form>
        </div>
      </div>
    </div>
  )
}

export default PAGE_CHECKOUT