// Style
import "./Panel_OrderDetails.scss";

const PANEL_ORDERDETAILS = ({orderId, itemIndex}) => {
  return (
    <div className="p-orderDetails">
        <div className="p-orderDetails__headings">
            <h1>ORDER #{orderId}</h1>
            <h2>CROPPED TUXEDO BLAZER TUXEDO</h2>
        </div>
        <div className="p-orderDetails__timeline">
            <div>
                <div className="left">
                    <p>Purchased</p>
                    <p>May 6, 2022</p>
                </div>
                <div className="middle">
                    <p>In Progress</p>
                    <p>May 7, 2022</p>
                </div>
                <div className="right">
                    <p>Arrived</p>
                    <p>May 13, 2022</p>
                </div>
            </div>
            <div>
                <span />
                <span />
                <span />
                <span />
            </div>
        </div>
        <div className="p-orderDetails__addresses">
            <div className="p-orderDetails__addresses--box">
                <h1>Billing Address</h1>
                <div>
                    <p>HOME</p>
                    <p>James Brown</p>
                    <p>California, Los Angeles</p>
                    <p>Funky Ave, 90001</p>
                    <p>USA</p>
                </div>
            </div>
            <div className="p-orderDetails__addresses--box">
                <h1>Shipping Address</h1>
                <div>
                    <p>HOME</p>
                    <p>James Brown</p>
                    <p>California, Los Angeles</p>
                    <p>Funky Ave, 90001</p>
                    <p>USA</p>
                </div>
            </div>
        </div>

        <div className="p-orderDetails__buttons">
            <button className="buttonS1">Cancel Order</button>
        </div>
    </div>
  )
}

export default PANEL_ORDERDETAILS