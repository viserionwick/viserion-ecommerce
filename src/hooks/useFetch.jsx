// Essentials
import {useEffect, useState} from 'react';

// Firebase
import { db } from '../firebase/Config';
import { doc, collection, getDoc, getDocs, query, orderBy, onSnapshot, where } from 'firebase/firestore';

const useFetch = (collectionName, documentName, fieldName, fieldValue, isFeildArray = false, isRealTime = false, orderListKey = undefined) => {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true); // initially "true" then when fetching
    const [loadingFetch, setLoadingFetch] = useState(false); // only "true" when fetching
    const [isEmpty, setIsEmpty] = useState(false);
    const [error, setError] = useState(null);

    // Query
    const [theQuery, setTheQuery] = useState(null);


    useEffect(() => {
        if(collectionName || documentName){
            if(documentName){
                const docRef = doc(db, collectionName, documentName);
                setLoading(true);
                setLoadingFetch(true);
                if (!isRealTime) {
                    getDoc(docRef)
                    .then((snapshot) => {
                        const data = snapshot.data();
                        if (data) {
                            if(data.length !== 0){
                                setData(data);
                                setLoading(false);
                                setLoadingFetch(false);
                                setIsEmpty(false);
                            } else{
                                setData(null);
                                setLoading(false);
                                setLoadingFetch(false);
                                setIsEmpty(true);
                            }
                        } else{
                            setData(null);
                            setLoading(false);
                            setLoadingFetch(false);
                            setIsEmpty(true);
                        }
                    })
                    .catch((err) => {
                        setError(err);
                        setData(null);
                        setLoading(false);
                        setLoadingFetch(false);
                        setIsEmpty(true);
                    });
                } else {
                    const unsub = onSnapshot(docRef, (snapshot) => {
                        const data = snapshot.data();
                        if (data) {
                            if(data.length !== 0){
                                setData(data);
                                setLoading(false);
                                setLoadingFetch(false);
                                setIsEmpty(false);
                            } else{
                                setData(null);
                                setLoading(false);
                                setLoadingFetch(false);
                                setIsEmpty(true);
                            }
                        } else{
                            setData(null);
                            setLoading(false);
                            setLoadingFetch(false);
                            setIsEmpty(true);
                        }
                    }, (err) => {
                        setError(err);
                        setData(null);
                        setLoading(false);
                        setLoadingFetch(false);
                        setIsEmpty(true);
                    });

                    return () => unsub();
                }
            } else{
                const collRef = collection(db, collectionName);
                /* const q = !orderListKey ? query(collRef) : query(collRef, orderBy(orderListKey)); */
                setLoading(true);
                setLoadingFetch(true);
                const querySend = (q) => {
                    if (!isRealTime) {
                        getDocs(q)
                        .then((snapshot) => {
                            const data = snapshot.docs.map((doc) => (
                                {...doc.data(), id: doc.id}
                            ));
                            if (data) {
                                if(data.length !== 0){
                                    setData(data);
                                    setLoading(false);
                                    setLoadingFetch(false);
                                    setIsEmpty(false);
                                } else{
                                    setData(null);
                                    setLoading(false);
                                    setLoadingFetch(false);
                                    setIsEmpty(true);
                                }
                            } else{
                                setData(null);
                                setLoading(false);
                                setLoadingFetch(false);
                                setIsEmpty(true);
                            }
                        })
                        .catch((err) => {
                            setError(err);
                            setData(null);
                            setLoading(false);
                            setLoadingFetch(false);
                            setIsEmpty(true);
                        }); 
                    } else {
                        const unsub = onSnapshot(q, (snapshot) => {
                            const data = snapshot.docs.map((doc) => (
                                {...doc.data(), id: doc.id}
                            ));
                            if (data) {
                                if(data.length !== 0){
                                    setData(data);
                                    setLoading(false);
                                    setLoadingFetch(false);
                                    setIsEmpty(false);
                                } else{
                                    setData(null);
                                    setLoading(false);
                                    setLoadingFetch(false);
                                    setIsEmpty(true);
                                }
                            } else{
                                setData(null);
                                setLoading(false);
                                setLoadingFetch(false);
                                setIsEmpty(true);
                            }
                        }, (err) => {
                            setError(err);
                            setData(null);
                            setLoading(false);
                            setLoadingFetch(false);
                            setIsEmpty(true);
                        })
    
                        return () => unsub();
                    }
                }

                if( !fieldName && !fieldValue ){
                    const q = !orderListKey ? query(collRef) : query(collRef, orderBy(orderListKey));
                    querySend(q);
                } else {
                    if ( !isFeildArray ) {
                        const q = !orderListKey ? query(collRef, where(fieldName, "==", fieldValue)) : query(collRef, where(fieldName, "==", fieldValue), orderBy(orderListKey));
                        querySend(q);
                    } else {
                        const q = !orderListKey ? query(collRef, where(fieldName, "array-contains", fieldValue)) : query(collRef, where(fieldName, "array-contains", fieldValue), orderBy(orderListKey));
                        querySend(q);
                    }
                }
            }
        }
    }, [collectionName, documentName, fieldName, fieldValue, isFeildArray, isRealTime, orderListKey])


    // Function
    const fetch = (collectionName, documentName, fieldName, fieldValue, isFeildArray, isRealTime = false, orderListKey = undefined, orderListBy = "desc") => {
        if(collectionName || documentName){
            if(documentName){
                const docRef = doc(db, collectionName, documentName);
                setLoading(true);
                setLoadingFetch(true);
                if (!isRealTime) {
                    getDoc(docRef)
                    .then((snapshot) => {
                        const data = snapshot.data();
                        if (data) {
                            if(data.length !== 0){
                                setData(data);
                                setLoading(false);
                                setLoadingFetch(false);
                                setIsEmpty(false);
                            } else{
                                setData(null);
                                setLoading(false);
                                setLoadingFetch(false);
                                setIsEmpty(true);
                            }
                        } else{
                            setData(null);
                            setLoading(false);
                            setLoadingFetch(false);
                            setIsEmpty(true);
                        }
                    })
                    .catch((err) => {
                        setError(err);
                        setData(null);
                        setLoading(false);
                        setLoadingFetch(false);
                        setIsEmpty(true);
                    });
                } else {
                    const unsub = onSnapshot(docRef, (snapshot) => {
                        const data = snapshot.data();
                        if (data) {
                            if(data.length !== 0){
                                setData(data);
                                setLoading(false);
                                setLoadingFetch(false);
                                setIsEmpty(false);
                            } else{
                                setData(null);
                                setLoading(false);
                                setLoadingFetch(false);
                                setIsEmpty(true);
                            }
                        } else{
                            setData(null);
                            setLoading(false);
                            setLoadingFetch(false);
                            setIsEmpty(true);
                        }
                    }, (err) => {
                        setError(err);
                        setData(null);
                        setLoading(false);
                        setLoadingFetch(false);
                        setIsEmpty(true);
                    });

                    return () => unsub();
                }
            }else{
                const collRef = collection(db, collectionName);

                setLoading(true);
                setLoadingFetch(true);
                const querySend = (q) => {
                    if (!isRealTime) {
                        getDocs(q)
                        .then((snapshot) => {
                            const data = snapshot.docs.map((doc) => (
                                {...doc.data(), id: doc.id}
                            ));
                            if (data) {
                                if(data.length !== 0){
                                    setData(data);
                                    setLoading(false);
                                    setLoadingFetch(false);
                                    setIsEmpty(false);
                                } else{
                                    setData(null);
                                    setLoading(false);
                                    setLoadingFetch(false);
                                    setIsEmpty(true);
                                }
                            } else{
                                setData(null);
                                setLoading(false);
                                setLoadingFetch(false);
                                setIsEmpty(true);
                            }
                        })
                        .catch((err) => {
                            setError(err);
                            setData(null);
                            setLoading(false);
                            setLoadingFetch(false);
                            setIsEmpty(true);
                        }); 
                    } else {
                        const unsub = onSnapshot(q, (snapshot) => {
                            const data = snapshot.docs.map((doc) => (
                                {...doc.data(), id: doc.id}
                            ));
                            if (data) {
                                if(data.length !== 0){
                                    setData(data);
                                    setLoading(false);
                                    setLoadingFetch(false);
                                    setIsEmpty(false);
                                } else{
                                    setData(null);
                                    setLoading(false);
                                    setLoadingFetch(false);
                                    setIsEmpty(true);
                                }
                            } else{
                                setData(null);
                                setLoading(false);
                                setLoadingFetch(false);
                                setIsEmpty(true);
                            }
                        }, (err) => {
                            setError(err);
                            setData(null);
                            setLoading(false);
                            setLoadingFetch(false);
                            setIsEmpty(true);
                        })
    
                        return () => unsub();
                    }
                }

                if( !fieldName && !fieldValue ){
                    const q = !orderListKey ? query(collRef) : query(collRef, orderBy(orderListKey));
                    querySend(q);
                } else {
                    if ( !isFeildArray ) {
                        const q = !orderListKey ? query(collRef, where(fieldName, "==", fieldValue)) : query(collRef, where(fieldName, "==", fieldValue), orderBy(orderListKey));
                        querySend(q);
                    } else {
                        const q = !orderListKey ? query(collRef, where(fieldName, "array-contains", fieldValue)) : query(collRef, where(fieldName, "array-contains", fieldValue), orderBy(orderListKey));
                        querySend(q);
                    }
                }

            }
        }
    }
    

    return {fetch, data, loading, loadingFetch, isEmpty, error}
}

export default useFetch;