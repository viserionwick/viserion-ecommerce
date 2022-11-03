// Essentials
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

// Contexts
import { usePanelContext } from '../../contexts/Panel';

// Hooks
import useTabTitle from '../../hooks/useTabTitle';
import useEstimate from '../../hooks/useEstimate';
import useCouponCode from '../../hooks/useCouponCode';

// Panels
import PANEL_EDITITEM from '../../components/panels/shoppingBag/Panel_EditItem';

// Styles
import './Page_ShoppingBag.scss';

// Jotai
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// GLOBAL STATES
export const shoppingBagList_atom = atomWithStorage("shoppingBagList", []);

function PAGE_SHOPPINGBAG() {

  useTabTitle("Shopping Bag");

  // Shopping Bag Item List
  const [shoppingBagList, setShoppingBagList] = useAtom(shoppingBagList_atom);

  // Remove Item
  const handleRemove = (productId) => {
    const newList = [...shoppingBagList.filter((item) => item.productId !== productId)];
    setShoppingBagList(newList);
  }
  

  const preOrderDate_toDate = (date) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    let oldDate = new Date(date.seconds * 1000);
    let newDate = monthNames[oldDate.getMonth()] +" "+ oldDate.getDate() +", "+ oldDate.getFullYear();

    return (newDate)
  }

  // Edit Item: Handle
  const { showPanel } = usePanelContext();
  const handleEdit = (itemProductId, itemIndex) => {
    showPanel( <PANEL_EDITITEM itemProductId={itemProductId} itemIndex={itemIndex} /> , "Edit" );
  }

  // Edit Item: Quantity
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

  

  // Coupon Code 
  const {
    /* STATES */
    couponCode,
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
  const { estimatedTotal, couponCodeExtracted } = useEstimate(shoppingBagList, couponCodePersentage);  

  return (
    <div className="p-shoppingBag">
      <h1 className="p-shoppingBag--header">
        Shopping Bag {shoppingBagList.length > 0 ? `| ${shoppingBagList.length}` : null}
      </h1>
      <div className="p-shoppingBag--row">
        <div className="p-shoppingBag__list">
          {
            shoppingBagList.length === 0 ?
            <div className='p-shoppingBag__list--empty'>
              <h1>Your shopping bag is empty</h1> 
              <Link to="/" className='buttonS1'>Continue Shopping</Link>
            </div>
            :
            shoppingBagList.map((item, itemIndex) => (
            <div className="p-shoppingBag__list--item" key={itemIndex}>
              <Link to={`/product/${item.url}`} className="p-shoppingBag__list--item__picture buttonClear">
                <img src={item.image} alt="item_image" />
              </Link>
              <div className="p-shoppingBag__list--item--details">

                {/* Title & Price */}
                <div className="p-shoppingBag__list--item--details--titleAndPrice">
                  <Link to={`/product/${item.url}`} className='p-shoppingBag__list--item--details__title buttonClear'>
                    {item.title}
                  </Link>
                  <div className="p-shoppingBag__list--item--details__totalPrice">
                    {"$ " + (item.basePrice * item.quantity).toFixed(2).replace(/[.,]00$/, "")}
                  </div>
                </div>

                {/* Details */}
                <div className="p-shoppingBag__list--item--details--features">
                  <div className="p-shoppingBag__list--item--details--features__color">
                    <div>Color:</div>
                    <div>
                      <span style={{background: item.color}} />
                    </div>
                  </div>
                  <div className="p-shoppingBag__list--item--details--features__size">
                    <div>Size:</div>
                    <div>
                      <span>{item.size}</span>
                    </div>
                  </div>
                  <div className="p-shoppingBag__list--item--details--features__quantity">
                    <div>Quantity:</div>
                    <div>
                      <div className="p-shoppingBag__list--item--details--features__quantity--control">
                        <button onClick={() => handleQuantity("decrease", itemIndex)} className='buttonS3--clear'><i className="fa-solid fa-minus"></i></button>
                          <span>{item.quantity}</span>
                        <button onClick={() => handleQuantity("increase", itemIndex)} className='buttonS3--clear'><i className="fa-solid fa-plus"></i></button>
                      </div>
                      {
                        item.quantity >= item.maxQuantity ?
                          <div>
                            <p className='p-shoppingBag__list--item--features__quantity--limitError'>Limit reached.</p>
                          </div>
                          :
                          null
                      }
                    </div>
                  </div>
                </div>

                {/* Buttons & Pre-Order Info */}
                <div className="p-shoppingBag__list--item--details--buttonsAndInfo">
                  <div className="p-shoppingBag__list--item--details__preOrderDate">
                  {
                    item.status === 2 ?
                    <>
                    PRE-ORDER (Available on: {preOrderDate_toDate(item.preOrderDate)})
                    </>
                    :
                    null
                  }
                  </div>
                  
                  <div className="p-shoppingBag__list--item--details__buttons">
                    <button className='p-shoppingBag__list--item--details__editButton buttonS1' onClick={() => handleEdit(item.productId, itemIndex)}>EDIT</button>
                    <button className='p-shoppingBag__list--item--details__removeButton buttonS1' onClick={() => handleRemove(item.productId)}>REMOVE</button>
                  </div>
                </div>
                
              </div>
              
            </div>
            ))
          }
        </div>
      </div>

      {
        shoppingBagList.length > 0 &&
        <>
        <div className="p-shoppingBag--afterMath">
          <form onSubmit={couponCodeSubmit} className="p-shoppingBag--afterMath__coupon formS1">
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
          <div className="p-shoppingBag--afterMath__total">
            <div className="p-shoppingBag--afterMath__total--line">
              <h4>Shipping Cost</h4>
              <p>$ 0.00</p>
            </div>
            <div className="p-shoppingBag--afterMath__total--line">
              <h4>Sales Tax</h4>
              <p>$ 0.00</p>
            </div>
            {
              couponCodePersentage ?
              <div className="p-shoppingBag--afterMath__total--line">
                <h4><button className='buttonS1' onClick={couponCodeRemove}>Remove</button>Coupon Code: {couponCodeSnapshot} ({couponCodePersentage}%)</h4>
                <p>- $ {couponCodeExtracted && couponCodeExtracted.toFixed(2).replace(/[.,]00$/, "")}</p>
              </div>
              : ""
            }
            <div className="p-shoppingBag--afterMath__total--line total">
              <h4>Estimated Total</h4>
              <p>$ {estimatedTotal && estimatedTotal}</p>
            </div>
          </div>
        </div>
  
        <div className="p-shoppingBag--checkoutButton">
          <Link to="/checkout" className='buttonS2'>Proceed To Checkout</Link>
        </div>
        </>
      }
    </div>
  )
}

export default PAGE_SHOPPINGBAG