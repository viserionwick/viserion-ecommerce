// Essentials
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Contexts
import { usePanelContext } from "../../../../contexts/Panel";
import { useAuthContext } from "../../../../contexts/Auth";

// Hooks
import useFetch from "../../../../hooks/useFetch";
import useTabTitle from "../../../../hooks/useTabTitle";

// Panels
import PANEL_ORDERPLACED from "../../../../components/panels/checkout/Panel_OrderPlaced";

// Style
import "./Page_Orders.scss";


const PAGE_ORDERS = () => {

  // Title
  useTabTitle("My Orders");

  const { currentUser: user, currentUserData: userData, loading } = useAuthContext();
  const { showPanel } = usePanelContext();

  // Fetch
  const { fetch, data: orders } = useFetch();

  useEffect(() => {
    userData && fetch("orders", undefined, "userId", userData.userId, undefined, true);
  }, [userData]);

  // States
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    if (orders) {
      let newOrders = [...orders];
      
      newOrders.sort((a,b) => {
        return b.purchasedAt.toDate() - a.purchasedAt.toDate();
      });

      setAllOrders(newOrders);
    } else {
      setAllOrders([]);
    }
  }, [orders]);


  // Estimate Payed for Single Orders
  const estimateInline = (products, coupon) => {

    let estimatedTotal = 0;

    if (!coupon) { // Without Coupon
      let baseTotal = 0;

      products.map(item => (
          baseTotal = baseTotal + (item.basePrice * item.quantity)
      ));

      estimatedTotal = baseTotal;

      return estimatedTotal;
    } else { // With Coupon
        let baseTotal = 0;
        let baseTotalNew = 0;

        products.map(item => (
            baseTotal = baseTotal + (item.basePrice * item.quantity)
        ));

        baseTotalNew = baseTotal - (baseTotal * coupon / 100);
        
        estimatedTotal = baseTotalNew.toFixed(2).replace(/[.,]00$/, "");

        return estimatedTotal;
    }
  }


  // Pre Order FB Date To Date
  const preOrderDate_toDate = (date) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    let oldDate = date.toDate();
    let newDate = monthNames[oldDate.getMonth()] +" "+ oldDate.getDate() +", "+ oldDate.getFullYear();

    return (newDate)
  }


  const handleDetails = (order) => {
    showPanel(<PANEL_ORDERPLACED order={order} />, "Order Details");
    console.log(order);
  }

  return (
    <>
    { userData ?
    
      <div className="p-orders">
        {
          allOrders ? <>
          <h1 className="p-orders--header">
            All Orders {allOrders.length > 0 ? `| ${allOrders.length}` : null}
          </h1>
          <div className="p-orders--row">
            <div className="p-orders__list">
              {
                allOrders.length === 0 ?
                <div className='p-orders__list--empty'>
                  <h1>You haven't ordered anything yet.</h1> 
                  <Link to="/" className='buttonS1'>Continue Shopping</Link>
                </div>
                :
                allOrders.map((order, orderIndex) => (
                  order.products.length > 1 ? 
                  <div className="p-orders__list--groupItems" key={orderIndex}>
                    <div className="p-orders__list--groupItem--wrapper">
                      {
                        order.products.map((item, itemIndex) => (
                          itemIndex <= 3 && <Link to={`/product/${item.url}`} className="p-orders__list--groupItem" key={itemIndex}>
                            <img src={item.image} alt="item_image" />
                          </Link>
                        ))
                      }
                    </div>
                    <div className="p-orders__list--groupItems--details">
                      <p>{order.products.length} ITEMS</p>
                      <span>
                        <p>ORDER ID</p>
                        <p>#{order.orderId}</p>
                      </span>
                      <button className='buttonS1' onClick={() => handleDetails(order)}>DETAILS</button>
                    </div>
                  </div>
                  :
                  order.products.map((item, itemIndex) => (
                    <div className="p-orders__list--item" key={itemIndex}>
                      <Link to={`/product/${item.url}`} className="p-orders__list--item__picture buttonClear">
                        <img src={item.image} alt="item_image" />
                      </Link>
                      <div className="p-orders__list--item--details">

                        {/* Title & Price */}
                        <div className="p-orders__list--item--details--titleAndPrice">
                          <Link to={`/product/${item.url}`} className='p-orders__list--item--details__title buttonClear'>
                            {item.title}
                          </Link>
                          <div className="p-orders__list--item--details__totalPrice">
                            {"$ " + estimateInline(order.products, order.couponCode && order.couponCode.percentage)}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-orders__list--item--details--features">
                          <div className="p-orders__list--item--details--features__orderId">
                            <div>ORDER ID:</div>
                            <div>
                              <span>#{order.orderId}</span>
                            </div>
                          </div>
                          <div className="p-orders__list--item--details--features__color">
                            <div>Color:</div>
                            <div>
                              <span style={{background: item.color}} />
                            </div>
                          </div>
                          <div className="p-orders__list--item--details--features__size">
                            <div>Size:</div>
                            <div>
                              <span>{item.size}</span>
                            </div>
                          </div>
                          <div className="p-orders__list--item--details--features__quantity">
                            <div>Quantity:</div>
                            <div>
                              <span>{item.quantity}</span>
                            </div>
                          </div>
                        </div>

                        {/* Buttons & Pre-Order Info */}
                        <div className="p-orders__list--item--details--buttonsAndInfo">
                          <div className="p-orders__list--item--details__preOrderDate">
                          {
                            item.status === 2 ?
                            <>
                            PRE-ORDER (Available on: {preOrderDate_toDate(item.preOrderDate)})
                            </>
                            :
                            null
                          }
                          </div>
                          
                          <div className="p-orders__list--item--details__buttons">
                            <button className='buttonS1' onClick={() => handleDetails(order)}>DETAILS</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ))
              }
            </div>
          </div>
          </>
          :
          <span className='loadingZone'>
            <span className='loadingS1'/>
          </span>
        }
      </div>
      :
      <span className='loadingZone'>
        <span className='loadingS1'/>
      </span>
    }
    </>
  )
}

export default PAGE_ORDERS