// Essentials
import { Navigate, useParams } from "react-router-dom"

// Components
import DASHBOARD_ORDERS from "../content/orders/Dashboard_Orders";
import DASHBOARD_PRODUCTS from "../content/products/Dashboard_Products";


const D_CONTENT = () => {

  const { id: content } = useParams();
  

  return (
    <div className="p-dashboard__content">
      {
        content ?
          // CONTENT
          content === "products" ? <DASHBOARD_PRODUCTS /> :
          content === "orders" ? <DASHBOARD_ORDERS /> :
          content === "analytics" ? <DASHBOARD_PRODUCTS /> :

          // PEOPLE
          content === "users" ? <DASHBOARD_PRODUCTS /> :
          content === "roles" ? <DASHBOARD_PRODUCTS /> :

          // CONTENT
          content === "design" ? <DASHBOARD_PRODUCTS /> :
          content === "pages" ? <DASHBOARD_PRODUCTS />

          
          : // PAGE NOT FOUND
          <Navigate to="/dashboard" />
        :
        <Navigate to="/dashboard/products" />
      }
    </div>
  )
}

export default D_CONTENT