// Essentials
import { useEffect, useState } from "react";

// Hooks
import useFetch from "./useFetch";


// Jotai
import { useAtom } from 'jotai';
import { atomWithStorage, RESET } from 'jotai/utils';

// GLOBAL STATES
export const couponCode_atom = atomWithStorage("couponCode", null);

const useCouponCode = () => {

    // Coupon Code
    const {fetch, data: ccData, loading: ccLoading, loadingFetch: ccLoadingFetch, isEmpty: ccIsEmpty, error: ccError} = useFetch();
    
    // Coupon Code: States
    const [couponCode_global, setCouponCode_global] = useAtom(couponCode_atom);
    const [couponCode, setCouponCode] = useState("");
    const [couponCodeSnapshot, setCouponCodeSnapshot] = useState("");
    const [couponCodePersentage, setCouponCodePersentage] = useState(0);
    const [couponCodeResult, setCouponCodeResult] = useState("");
    const [couponCodeError, setCouponCodeError] = useState(false);

    // Coupon Code: Result
    const couponCodeAgent = (ccData, fromGlobal = false) => {
        const regex = /\s{2,}/g;
        const today = new Date();
        const expiresAt = new Date(ccData.expiresAt.seconds * 1000);
        
        if (today.getTime() < expiresAt.getTime()){
            setCouponCode_global(ccData);

            setCouponCodePersentage(ccData.percentage);
            setCouponCodeResult(<p className='success'>Coupon code "<b>{!fromGlobal ? couponCode : ccData.code}</b>" was added.</p>);

            setCouponCodeSnapshot((!fromGlobal ? couponCode : ccData.code).replace(regex, ' ').trim());
        } 

        else if (today.getTime() > expiresAt.getTime()){ // EXPIRED
            setCouponCodePersentage(0);
            setCouponCodeResult(<p className='error'>Coupon code "<b>{couponCode}</b>" is <b>expired</b>.</p>);

            setCouponCodeSnapshot((!fromGlobal ? couponCode : ccData.code).replace(regex, ' ').trim());
        }
    }

    useEffect(() => {
        if (ccData) {
            if (!ccLoadingFetch) {
                couponCodeAgent(ccData, false);
            }
        }
        else if (ccIsEmpty) {
            setCouponCodeResult(<p className='error'>Coupon code "<b>{couponCode}</b>" doesn't exist.</p>);
        }
        else if (ccError) {
            setCouponCodeResult(<p className='error'>Error: {ccError}</p>);
        }
        else {
            if (couponCode_global) {
                couponCodeAgent(couponCode_global, true);
            }
        }
        
        if (ccLoadingFetch) {
            setCouponCodeResult(<span className="loadingS1" style={{marginTop: "10px", marginBottom: "-15px", transform: "scale(0.7)"}}/>);
        }
    }, [ccData, ccLoadingFetch, ccIsEmpty, ccError]);

    // Coupon Code: Submit
    const couponCodeSubmit = (e, stateSend = false) => {
        if (!stateSend) {
            e.preventDefault();
            const regex = /\s{2,}/g;
            const code = couponCode.replace(regex, ' ').trim();
            setCouponCode(code);
    
            if (code !== "") {
                fetch("coupons", code);
                
                setCouponCodeError(false);
            }
            else {
                setCouponCodeError(true);
            }
        } else {
            const regex = /\s{2,}/g;
            const code = stateSend.replace(regex, ' ').trim();
            setCouponCode(code);
    
            if (code !== "") {
                fetch("coupons", code);
                
                setCouponCodeError(false);
            }
            else {
                setCouponCodeError(true);
            }
        }
    }

    // Coupon Code: Handle
    const couponCodeHandler = (e) => {
        const { value } = e.target;
        setCouponCode(value);
        setCouponCodeError(false);
    }

    // Coupon Code: Remove
    const couponCodeRemove = () => {
        setCouponCodePersentage(0);
        setCouponCodeResult("");
        setCouponCode_global(RESET);
    }

    return {
        /* STATES */
        couponCode, 
        couponCode_global,
        setCouponCode_global,
        couponCodeSnapshot,
        couponCodePersentage,
        couponCodeResult,
        couponCodeError,

        /* FETCH STATES*/
        ccData,
        ccLoading,
        ccLoadingFetch,
        ccIsEmpty,
        ccError,
        
        /* FUNCTIONS */
        couponCodeSubmit,
        couponCodeHandler,
        couponCodeRemove
    }
}

export default useCouponCode