// Essentials
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Firebase
import { addDoc, collection, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/Config";

// Contexts
import { useAuthContext } from "../contexts/Auth";
import { usePanelContext } from "../contexts/Panel";

// Hooks

// Panels
import PANEL_ORDERPLACED from "../components/panels/checkout/Panel_OrderPlaced";


// Jotai
import { useAtom } from "jotai";
import { RESET } from "jotai/utils";

// GLOBAL STATES
import { shoppingBagList_atom } from "../pages/bag/Page_ShoppingBag";

const usePlaceOrder = () => {

    // Redirect
    const navigate = useNavigate();

    // Contexts
    const { currentUser: isAuth } = useAuthContext();
    const { showPanel } = usePanelContext();

    // States
    const [orderFetch, setOrderFetch] = useState(undefined);

    // GLOBAL STATES
    const [shoppingBagList, setShoppingBagList] = useAtom(shoppingBagList_atom);


    const placeOrder = (purchasedAt, products, estimatedTotal, couponCode, shippingTo, billingTo, email, phoneNumber, userId) => {

        const randomOrderId = () => {
            let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            let length = 10;
            let orderId = "";

            for (var i = 0; i <= length; i++) {
                let randomNumber = Math.floor(Math.random() * chars.length);
                orderId += chars.substring(randomNumber, randomNumber +1);
            }

            return orderId;
        }

        const orderCalc = () => {
            const orderId = randomOrderId();

            if (userId) {
                if (couponCode) {
                    return {
                        orderId,
                        purchasedAt,
                        products,
                        estimatedTotal,
                        couponCode,
                        shippingTo,
                        billingTo,
                        email,
                        phoneNumber,
                        userId
                    }
                } else {
                    return {
                        orderId,
                        purchasedAt,
                        products,
                        estimatedTotal,
                        shippingTo,
                        billingTo,
                        email,
                        phoneNumber,
                        userId
                    }
                }
            } else {
                if (couponCode) {
                    return {
                        orderId,
                        purchasedAt,
                        products,
                        estimatedTotal,
                        couponCode,
                        shippingTo,
                        billingTo,
                        email,
                        phoneNumber,
                    }
                } else {
                    return {
                        orderId,
                        purchasedAt,
                        products,
                        estimatedTotal,
                        shippingTo,
                        billingTo,
                        email,
                        phoneNumber,
                    }
                }
            }
        } 

        const newOrder = orderCalc();
        
        // Add The Order
        addDoc(collection(db, "orders"), newOrder)
        .then((docRef) => {
            getDoc(docRef) // Retrieve The Order
            .then(snapshot => {
                const data = snapshot.data();
                if (data) {
                    setOrderFetch({...data, id: snapshot.id})
                }

                updateDoc(docRef, {
                    id: docRef.id
                })
            });
        })        
    }

    useEffect(() => {
        if (orderFetch) {

            setShoppingBagList(RESET);

            if (isAuth) {
                navigate("/account");
                showPanel(<PANEL_ORDERPLACED order={orderFetch}/>, "Purchase Successful");
            } else {
                navigate("/bag");
                showPanel(<PANEL_ORDERPLACED order={orderFetch}/>, "Purchase Successful");
            }
        }
    }, [orderFetch]);
    
  return { placeOrder }

}

export default usePlaceOrder