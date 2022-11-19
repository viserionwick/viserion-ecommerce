// Essentials
import { useEffect, useState } from "react";

// Contexts
import { useAuthContext } from "../contexts/Auth";

const useTabMenuLinks = () => {

    const { currentUserData: userData, passRoles, logOut } = useAuthContext();

    // Tab Menu
    const initLinks = [
        {
            title: "Orders",
            url: "/account?q=orders"
        },
        {
            title: "Profile",
            url: "/account?q=profile"
        },
        {
            title: "Log Out",
            onclick: () => logOut()
        }
    ];

    const [tabMenuLinks, setTabMenuLinks] = useState(initLinks);    
        
    
    // Set Tab    
    useEffect(() => {
        // Check Role
        if(userData && passRoles.length !== 0){
            if(passRoles.includes(userData.role)){
                const newLinks = [
                    {
                        title: "Orders",
                        url: "/account?q=orders"
                    },
                    {
                        title: "Profile",
                        url: "/account?q=profile"
                    },
                    {
                        title: "Dashboard",
                        url: "/dashboard"
                    },
                    {
                        title: "Log Out",
                        onclick: () => logOut()
                    }
                ];
    
                setTabMenuLinks(newLinks);
            } else {
                setTabMenuLinks(initLinks);
            }
        } else {
            setTabMenuLinks(initLinks);
        }
        
    }, [userData, passRoles]);

    return { tabMenuLinks }
}

export default useTabMenuLinks