// Essentials
import { useEffect, useState } from "react";

const useLocalStorage = (storageKey) => {

    // State
    const [storedData, setStoredData] = useState();

    const checkStorage = (key) => {
        const data = localStorage.getItem(key);

        if (data) {
            setStoredData(data);
        } else {
            setStoredData(null);
        }
    }
   
    useEffect(() => {
        checkStorage(storageKey);


        const handler = () => checkStorage(storageKey);
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, []);


    const dispatch = () => {
        window.dispatchEvent(new Event("storage"));
    }

    return {storedData, dispatch}
}

export default useLocalStorage;