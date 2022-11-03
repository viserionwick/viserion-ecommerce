// Essentials
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";

// Style
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./Item.scss";

const ITEM = ({title, price, images, status, url}) => {

  /* console.log(images); */

  // Status Calculator
  const renderStatus = (param) => {
    switch (param) {
      case 0:
        return "Out of stock";
      case 1:
        return "In stock";
      case 2:
        return "Pre-order now";
      case 3:
        return "Coming soon";
    
      default:
        break;
    }
  }
  
  return (
    <div className='item noSelection'>
      <Swiper
        pagination={{
          dynamicBullets: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper item--images"
      >
        {
          images && images.map((img, i) => (
            <SwiperSlide key={i}>
              <Link to={url ? "/product/" + url : "/"} className="buttonClear">
                <img src={img} alt="item_image"/>
              </Link>
            </SwiperSlide>
          ))
        }
      </Swiper>

      <Link to={url ? "/product/" + url : "/"} className="buttonClear">
        <div className="item--info">
          {title ? <h1>{title}</h1> : null}
          {price ? <h6>{"$ " + price/* .toFixed(2).replace(/[.,]00$/, "") */}</h6> : null}
          {status !== 1 ? <h6>{renderStatus(status)}</h6> : null}
        </div>
      </Link>      
    </div>
  )
}

export default ITEM