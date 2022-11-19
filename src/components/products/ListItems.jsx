// Essentials
import { Link } from "react-router-dom"

// Style
import "./ListItems.scss";

const LISTITEMS = ({list, edit = true, remove = true, quantity = true}) => {
  return (
    <div className="listItems">
      
      {
        list.length === 0 ?
        <div className="listItems--empty">
            <h1>Your shopping bag is empty</h1> 
            <Link to="/" className='buttonS1'>Continue Shopping</Link>
        </div>
        :
        list.map((item, i) => (
        <div className="listItem" key={i}>
          <Link to={`/product/${item.url}`} className="listItem__picture">
            <img src={item.image} alt="item_image" />
          </Link>
          <div className="listItem__details">
            <div className="listItem__details--titleAndPrice">
              <Link to={`/product/${item.url}`} className='listItem__details--title'>
                {item.title}
              </Link>
              <div className="listItem__details--totalPrice">
                {"$ " + (item.basePrice * item.quantity).toFixed(2).replace(/[.,]00$/, "")}
              </div>
            </div>
            <div className="listItem__details--features">
              <div className="listItem__details--features__color">
                <div>Color:</div>
                <div>
                  <span style={{background: item.color}} />
                </div>
              </div>
              <div className="listItem__details--features__size">
                <div>Size:</div>
                <div>
                  <span>{item.size}</span>
                </div>
              </div>
              <div className="listItem__details--features__quantity">
                <div>Quantity:</div>
                <div>
                  {/* <div className="listItem__details--features__quantity--control">
                    <button onClick={() => handleQuantity("decrease", itemIndex)} className='buttonS3--clear'><i className="fa-solid fa-minus"></i></button>
                      <span>{item.quantity}</span>
                    <button onClick={() => handleQuantity("increase", itemIndex)} className='buttonS3--clear'><i className="fa-solid fa-plus"></i></button>
                  </div> */}
                  {
                    item.quantity >= item.maxQuantity ?
                      <div>
                        <p className='listItem__details--features__quantity--limitError'>Limit reached.</p>
                      </div>
                      :
                      null
                  }
                </div>
              </div>
            </div>
            <div className="listItem__details--buttonsAndInfo">
              <div className="listItem__details--preOrderDate">
              {/* {
                item.status === 2 ?
                <>
                PRE-ORDER (Available on: {preOrderDate_toDate(item.preOrderDate)})
                </>
                :
                null
              } */}
              </div>
              
              {/* <div className="listItem__details--buttons">
                <button className='listItem__details--editButton buttonS1' onClick={() => handleEdit(item.productId, itemIndex)}>EDIT</button>
                <button className='listItem__details--removeButton buttonS1' onClick={() => handleRemove(item.productId)}>REMOVE</button>
              </div> */}
            </div>
          </div>
        </div>
        ))
      }
    </div>
  )
}

export default LISTITEMS