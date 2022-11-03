import { useEffect, useState } from "react";

const siteTitle = "BALENCIAGA";
const titleSeparator = "|";

const useTabTitle = (defaultTitle) => {

    const [tabTitle, setTabTitle] = useState();
    
    useEffect(() => {
        if(!defaultTitle || defaultTitle === "") {
            if(!tabTitle || tabTitle === "") {
                document.title = siteTitle;
            }
            else {
                document.title = `${tabTitle} ${titleSeparator} ${siteTitle}`
            }
        }
        else {
            document.title = `${defaultTitle} ${titleSeparator} ${siteTitle}`
        }
    }, [tabTitle, defaultTitle]);

    return { tabTitle, setTabTitle }
}

export default useTabTitle;