// Essentials
import { useEffect, useState } from "react";

const useEstimate = (productList, couponCodePersentage = null) => {

    // States
    const [estimatedTotal, setEstimatedTotal] = useState();
    const [couponCodeExtracted, setCouponCodeExtracted] = useState(0);
    
    // Effect
    useEffect(() => {
        if (productList) {
            if (!couponCodePersentage) { // Without Coupon
                let baseTotal = 0;
    
                productList.map(item => (
                    baseTotal = baseTotal + (item.basePrice * item.quantity)
                ));
    
                setEstimatedTotal(baseTotal);
            } else { // With Coupon
                let baseTotal = 0;
                let baseTotalNew = 0;
    
                productList.map(item => (
                    baseTotal = baseTotal + (item.basePrice * item.quantity)
                ));
    
                baseTotalNew = baseTotal - (baseTotal * couponCodePersentage / 100);
                
                setCouponCodeExtracted((baseTotal - baseTotalNew));
                setEstimatedTotal(baseTotalNew.toFixed(2).replace(/[.,]00$/, ""));
            } 
        } 
    }, [productList, couponCodePersentage]);

    // Function
    const estimate = (productList, couponCodePersentage = null) => {
        if (!couponCodePersentage) { // Without Coupon
            let baseTotal = 0;

            productList.map(item => (
                baseTotal = baseTotal + (item.basePrice * item.quantity)
            ));

            setEstimatedTotal(baseTotal);
        } else { // With Coupon
            let baseTotal = 0;
            let baseTotalNew = 0;

            productList.map(item => (
                baseTotal = baseTotal + (item.basePrice * item.quantity)
            ));

            baseTotalNew = baseTotal - (baseTotal * couponCodePersentage / 100);
            
            setCouponCodeExtracted((baseTotal - baseTotalNew));
            setEstimatedTotal(baseTotalNew.toFixed(2).replace(/[.,]00$/, ""));
        }  
    }

  return { estimate, estimatedTotal, couponCodeExtracted }
}

export default useEstimate