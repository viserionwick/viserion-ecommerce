// Essentials
import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';

// Contexts
import { useAuthContext } from '../../../contexts/Auth';

// Hooks
import useTabMenuLinks from '../../../hooks/useTabMenuLinks';

// Components
import TABMENU from '../../../components/tabMenu/TabMenu';

// Pages
import PAGE_PROFILE from './Page_Profile';
import PAGE_ORDERS from './Page_Orders/Page_Orders';

// Style
import "../Page_Auth.scss";



function PAGE_ACCOUNT() {

    // Auth
    const { currentUser: user, currentUserData: userData, authLoading: loading } = useAuthContext();

    // Nav
    let navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [pageRender, setPageRender] = useState(null);

    useEffect(() => {
        let query = searchParams.get("q");

        query ?
        setPageRender(query)
        :
        navigate("/account?q=orders");

    }, [searchParams]);

    // Tab Menu
    const { tabMenuLinks } = useTabMenuLinks();

  return (
    <>
    {
        !loading && pageRender ?
            user ?
                <>
                {
                    userData &&
                    <TABMENU title={"WELCOME, " + userData.firstName} links={ tabMenuLinks } loading={loading}/>
                }
                {
                    pageRender === "orders" ?
                    <PAGE_ORDERS />
                    :
                    pageRender === "profile" ?
                    <PAGE_PROFILE />
                    
                    
                    : // Page Not Found
                    <Navigate to="/account" />
                }
                </>

            
            : // NOT LOGGED IN
            <Navigate to="/login" />
        
        
        : // LOADING
        <div className='loadingZone'>
            <span className='loadingS1'/>
        </div>
    }
    </>
  )
}

export default PAGE_ACCOUNT