// Essentials

// Contexts
import { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/Auth";

const useTabMenuLinks = () => {

    const { currentUserData: userData, logOut } = useAuthContext();

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
        if(userData){
            if(userData.role === "admin" || userData.role === "editor"){
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
            }
        }
        
    }, [userData]);

    return { tabMenuLinks }
}

export default useTabMenuLinks