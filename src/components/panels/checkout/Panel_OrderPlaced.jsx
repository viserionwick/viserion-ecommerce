// Essentials
import { useState } from "react";
import { Link } from "react-router-dom";

// Firebase
import { db } from "../../../firebase/Config";
import { doc, deleteDoc } from "firebase/firestore";

// Contexts
import { useAuthContext } from "../../../contexts/Auth";
import { usePanelContext } from "../../../contexts/Panel";

// Hooks
import useEstimate from "../../../hooks/useEstimate";

// Style
import "./Panel_OrderPlaced.scss"


const PANEL_ORDERPLACED = ({order}) => {

    // Contexts
    const { currentUserData: userData } = useAuthContext();
    const { closePanel } = usePanelContext();

    // States
    const [cancelling, setCancelling] = useState(false);

    // Estimate
    const { estimatedTotal, couponCodeExtracted } = useEstimate(order.products, order.couponCode ? order.couponCode.percentage : null);
    

    // Pre Order FB Date To Date
    const preOrderDate_toDate = (date) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
        let oldDate = date.toDate();
        let newDate = monthNames[oldDate.getMonth()] +" "+ oldDate.getDate() +", "+ oldDate.getFullYear();

        return (newDate)
    }

    // Timeline Dates
    const timeline = (date, status) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
        let originalDate = date.toDate();

        const addDays = (date, days) => {
            let result = new Date(date);
            result.setDate(result.getDate() + days);
            result = monthNames[result.getMonth()] +" "+ result.getDate() +", "+ result.getFullYear();
            return result;
        }

        switch (status) {
            case 1:
                return addDays(originalDate, 0);
                break;
            case 2:
                return addDays(originalDate, 7);
                break;
            case 3:
                return addDays(originalDate, 14);
                break;
            default:
                break;
        }
    }
    // Delete Document
    const handleCancelOrder = (order) => {        
        if (userData) {
            if (userData.userId === order.userId) {
                setCancelling(true);
                deleteDoc(doc(db, "orders", order.id))
                .then(() => {
                    closePanel();
                })
                .catch(() => {
                    setCancelling(false);
                })
            }
        } else {
            setCancelling(true);
            deleteDoc(doc(db, "orders", order.id))
            .then(() => {
                closePanel();
            })
            .catch(() => {
                setCancelling(false);
            })
        }
    }

  return (
    <div className="p-orderPlaced">
        <div className="p-orderPlaced__headings">
            <h1>ORDER #{ order.orderId }</h1>
        </div>
        <div className="p-orderPlaced__timeline">
            <div>
                <div className="left">
                    <p>Purchased</p>
                    <p>{timeline(order.purchasedAt, 1)}</p>
                </div>
                <div className="middle">
                    <p>In Progress</p>
                    <p>{timeline(order.purchasedAt, 2)}</p>
                </div>
                <div className="right">
                    <p>Arrived</p>
                    <p>{timeline(order.purchasedAt, 3)}</p>
                </div>
            </div>
            <div>
                <span />
                <span />
                <span />
                <span />
            </div>
        </div>
        <div className="p-orderPlaced__products">
        {
            order.products.map((item, itemIndex) => (
                <div className="p-orderPlaced__products--item" key={itemIndex}>
                    <Link to={`/product/${item.url}`} className="p-orderPlaced__products--item__picture buttonClear">
                        <img src={item.image} alt="item_image" />
                    </Link>
                    <div className="p-orderPlaced__products--item--details">

                        {/* Title & Price */}
                        <div className="p-orderPlaced__products--item--details--titleAndPrice">
                        <Link to={`/product/${item.url}`} className='p-orderPlaced__products--item--details__title buttonClear'>
                            {item.title}
                        </Link>
                        <div className="p-orderPlaced__products--item--details__totalPrice">
                            {"$ " + (item.basePrice * item.quantity).toFixed(2).replace(/[.,]00$/, "")}
                        </div>
                        </div>

                        {/* Details */}
                        <div className="p-orderPlaced__products--item--details--features">
                        <div className="p-orderPlaced__products--item--details--features__color">
                            <div>Color:</div>
                            <div>
                            <span style={{background: item.color}} />
                            </div>
                        </div>
                        <div className="p-orderPlaced__products--item--details--features__size">
                            <div>Size:</div>
                            <div>
                            <span>{item.size}</span>
                            </div>
                        </div>
                        <div className="p-orderPlaced__products--item--details--features__quantity">
                            <div>Quantity:</div>
                            <div>
                            <span>{item.quantity}</span>
                            </div>
                        </div>
                        </div>

                        {/* Buttons & Pre-Order Info */}
                        <div className="p-orderPlaced__products--item--details--buttonsAndInfo">
                        <div className="p-orderPlaced__products--item--details__preOrderDate">
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

        <div className="p-orderPlaced__paidTotal--afterMath">
            <div className="p-orderPlaced__paidTotal--afterMath__total">
                <div className="p-orderPlaced__paidTotal--afterMath__total--line">
                    <h4>Shipping Cost</h4>
                    <p>$ 0.00</p>
                </div>
                <div className="p-orderPlaced__paidTotal--afterMath__total--line">
                    <h4>Sales Tax</h4>
                    <p>$ 0.00</p>
                </div>
                {
                    order.couponCode ?
                    <div className="p-orderPlaced__paidTotal--afterMath__total--line">
                        <h4>Coupon: {order.couponCode.code} (-{order.couponCode.percentage}%)</h4>
                        <p>- $ {couponCodeExtracted && couponCodeExtracted.toFixed(2).replace(/[.,]00$/, "")}</p>
                    </div>
                    : ""
                }
                <div className="p-orderPlaced__paidTotal--afterMath__total--line total">
                    <h4>Paid Total</h4>
                    <p>$ {estimatedTotal && estimatedTotal}</p>
                </div>
            </div>
        </div>

        <div className="p-orderPlaced__addresses">
            <div className="p-orderPlaced__addresses--box">
                <h1>Shipping Address</h1>
                <div>
                    <p>{order.shippingTo.type}</p>
                    <p>{order.shippingTo.fullName}</p>
                    <p>{order.shippingTo.addressLine_1}</p>
                    <p>{order.shippingTo.addressLine_2}</p>
                    <p>{order.shippingTo.country}</p>
                </div>
            </div>
            <div className="p-orderPlaced__addresses--box">
                <h1>Billing Address</h1>
                <div>
                    <p>{order.billingTo.type}</p>
                    <p>{order.billingTo.fullName}</p>
                    <p>{order.billingTo.addressLine_1}</p>
                    <p>{order.billingTo.addressLine_2}</p>
                    <p>{order.billingTo.country}</p>
                </div>
            </div>
        </div>

        <div className="p-orderPlaced__buttons">
            {
              !cancelling ?
              <button className="buttonS1" onClick={() => handleCancelOrder(order)}>Cancel Order</button>
              :
              <button className="buttonS1" disabled>Please wait...</button>
            }
        </div>
    </div>
  )
}

export default PANEL_ORDERPLACED