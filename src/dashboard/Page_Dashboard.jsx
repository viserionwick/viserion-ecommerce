// Essentials
import { Navigate } from "react-router-dom";

// Contexts
import { useAuthContext } from "../contexts/Auth";

// Components
import D_CONTENT from "./components/layout/d_Content";
import D_MENU from "./components/layout/d_Menu";

// Style
import "./Page_Dashboard.scss"


const PAGE_DASHBOARD = () => {

  // Auth
  const { currentUser: user, currentUserData: userData, passRoles, authLoading: loading } = useAuthContext();

  return (
    <div className="p-dashboard">
      {
        !loading ?
          user ?
            userData && passRoles.length !== 0 ?
              passRoles.includes(userData.role) ?
              <>
              <D_MENU />
              <D_CONTENT />
              </>

              
              : // NOT AUTHORIZED
              <Navigate to="/account" />
            : // USER ROLE LOADING
            <div className='loadingZone'>
                <span className='loadingS1'/>
            </div>
            

          : // NOT LOGGED IN
          <Navigate to="/login" />
        : // LOADING
        <div className='loadingZone'>
            <span className='loadingS1'/>
        </div>
      }
    </div>
  )
}

export default PAGE_DASHBOARD