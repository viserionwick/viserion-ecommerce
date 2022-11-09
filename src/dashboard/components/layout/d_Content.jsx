// Essentials
import { Navigate, useParams } from "react-router-dom"

// Components
import DASHBOARD_ORDERS from "../content/orders/Dashboard_Orders";
import DASHBOARD_PRODUCTS from "../content/products/Dashboard_Products";

// Contexts
import { useAuthContext } from "../../../contexts/Auth";

const D_CONTENT = ({userRole, roles}) => {

  const { id: content } = useParams();
  
  // Read User Permissions
  const { userRoleAccess } = useAuthContext();

  return (
    <div className="p-dashboard__content">
      {
        content ?

          // CONTENT
          content === "products" ? 
            userRoleAccess.products ?
            <DASHBOARD_PRODUCTS />
            : <Navigate to="/dashboard" />
          :
          content === "orders" ? 
            userRoleAccess.orders ?
            <DASHBOARD_ORDERS />
            : <Navigate to="/dashboard" />
          :
          content === "analytics" ? 
            userRoleAccess.analytics ?
            <div>bruh</div>
            : <Navigate to="/dashboard" />
          :


          // PEOPLE
          content === "users" ? 
            userRoleAccess.users ?
            <div>bruh</div>
            : <Navigate to="/dashboard" />
          :
          content === "roles" ? 
            userRoleAccess.roles ?
            <div>bruh</div>
            : <Navigate to="/dashboard" />
          :


          // WEBSITE
          content === "design" ? 
            userRoleAccess.design ?
            <div>bruh</div>
            : <Navigate to="/dashboard" />
          :
          content === "pages" ? 
            userRoleAccess.pages ?
            <div>bruh</div>
            : <Navigate to="/dashboard" />

          
          : // PAGE NOT FOUND
          <Navigate to="/dashboard" />
        :
        "Welcome to dashboard"
      }
    </div>
  )
}

export default D_CONTENT