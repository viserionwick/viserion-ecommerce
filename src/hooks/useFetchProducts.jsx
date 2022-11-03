// Essentials
import { useEffect, useState } from "react";

// Firebase
import { db } from '../firebase/Config';
import { collection, getDocs, onSnapshot, query, where, limit, startAfter, orderBy } from 'firebase/firestore';

const useFetchProducts = (isFunc = true, fetchLimit, fieldName = false, fieldValue, isFeildArray = false, category = null, explore = false, isSearch = false, isRealTime = false) => {

  const [productsData, setProductsData] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true); // initially "true" then when fetching
  const [productsLoadingFetch, setProductsLoadingFetch] = useState(false); // only "true" when fetching
  const [productsError, setProductsError] = useState(null);
  const [isProductsEmpty, setIsProductsEmpty] = useState(false);
  
  const [fetchMore, setFetchMore] = useState(() => () => {});
  const [fetchLoading, setFetchLoading] = useState(false); // for fetching new set of additional items
  const [fetchEnded, setFetchEnded] = useState(false);
  
  
  useEffect(() => {
    if (!isFunc) {
      fetchProducts(fetchLimit, fieldName, fieldValue, isFeildArray, category, explore, isSearch, isRealTime)
    }
    
  }, [ fieldName, fieldValue, isFeildArray, isSearch, isRealTime ])
  
  const fetchProducts = (fetchLimit, fieldName = false, fieldValue, isFeildArray = false, category = null, explore = false, isSearch = false, isRealTime = false) => {
    let oldCategory = null;
    let oldSearch = null;


    const collRef = collection(db, "products");
    setProductsLoading(true);
    setProductsLoadingFetch(true);

    const querySend = (q, newCategory = null, newSearch = fieldValue) => {
      if (!isRealTime) {
        getDocs(q)
        .then((snapshot) => {
          const data = snapshot.docs.map((doc) => (
            {...doc.data(), id: doc.id}
          ));          
          if (data) {
              if(data.length !== 0){ // some data found
                if(!isSearch) {
                  if (oldCategory !== newCategory) { // new category
                    setProductsData(data);
                    oldCategory = newCategory;
                  } else { // same category
                    setProductsData(prevState => (
                      [ ...prevState, ...data]
                    ))    
                  }
                } else {
                  if (oldSearch !== newSearch) { // new search
                    setProductsData(data);
                    oldSearch = newSearch;
                  } else { // same search
                    setProductsData(prevState => (
                      [ ...prevState, ...data]
                    ))    
                  }
                }

                setProductsLoading(false);
                setProductsLoadingFetch(false);
                setFetchLoading(false);
                setIsProductsEmpty(false);
                setFetchEnded(false);

                const lastVisibleFetch = snapshot.docs[snapshot.docs.length - 1];
                setFetchMore(() => () => {
                  
                  queryCalc(lastVisibleFetch); // fetch new docs starting from the last.
                });

              } else{ // no data found
                if(!isSearch){
                  if (oldCategory !== newCategory) { // new category
                    setProductsData(null);
                    setProductsLoading(false);
                    setProductsLoadingFetch(false);
                    setIsProductsEmpty(true);
                    setFetchLoading(false);
                    oldCategory = newCategory;
                  } else { // same category
                    if(fetchLimit > 1) {
                      setFetchEnded(true);
                      setFetchLoading(false);
                    } else {
                      setProductsData(null);
                      setProductsLoading(false);
                      setProductsLoadingFetch(false);
                      setIsProductsEmpty(true);
                      setFetchLoading(false);
                    }
                  }
                } else {
                  setProductsLoading(false);
                  setProductsLoadingFetch(false);
                  
                  if (oldSearch !== newSearch) { // new search
                    setProductsData(null);
                    setIsProductsEmpty(true);
                    setFetchLoading(false);
                    oldSearch = newSearch;
                  } else { // same search
                    setFetchEnded(true);
                    setFetchLoading(false);
                  }
                }
              }
          } else{
            setProductsData(null);
            setProductsLoading(false);
            setProductsLoadingFetch(false);
            setFetchLoading(false);
            setIsProductsEmpty(true);
          }
        })
        .catch((err) => {
          setProductsError(err);
          setProductsData(null);
          setProductsLoading(false);
          setProductsLoadingFetch(false);
          setFetchLoading(false);
          setIsProductsEmpty(true);
        });

      } else {
        const unsub = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => (
            {...doc.data(), id: doc.id}
          ));
          if (data) {
            if(data.length !== 0){
              setProductsData(data);
              setProductsLoading(false);
              setProductsLoadingFetch(false);
              setFetchLoading(false);
              setIsProductsEmpty(false);
            } else{
              setProductsData(null);
              setProductsLoading(false);
              setProductsLoadingFetch(false);
              setFetchLoading(false);
              setIsProductsEmpty(true);
            }
          } else{
            setProductsData(null);
            setProductsLoading(false);
            setProductsLoadingFetch(false);
            setFetchLoading(false);
            setIsProductsEmpty(true);
          }
        }, (err) => {
          setProductsError(err);
          setProductsData(null);
          setProductsLoading(false);
          setProductsLoadingFetch(false);
          setFetchLoading(false);
          setIsProductsEmpty(true);
        })
  
        return () => unsub();
      }
    }



    const queryCalc = (lastVisibleFetch) => {
      if(!lastVisibleFetch) {
        if( !fieldName && !fieldValue ){
          if (category) {
            let q = !explore ?
            query(collRef, where("category", "in", category), orderBy("createdAt", "desc"), limit(fetchLimit))
            :
            query(collRef, where("category", "in", category), where("subCategories", "array-contains", "explorePage"), orderBy("createdAt", "desc"), limit(fetchLimit));

            querySend(q, category);
          } else {
            let q = query(collRef);
            querySend(q);
          }
        } else {
          if(category) {
            if ( isSearch ) {
              let q = query(collRef, where("category", "in", category), where(fieldName, ">=", fieldValue), where(fieldName, "<=", fieldValue + '\uf8ff'), orderBy("title"), orderBy("createdAt", "desc"), limit(fetchLimit));
              querySend(q, category);
              
            } else {
              let q = query(collRef, where("category", "in", category), where(fieldName, "array-contains", fieldValue), orderBy("createdAt", "desc"), limit(fetchLimit));
              querySend(q, category);
            }
          } else {
            if ( isSearch ) {
              let q = query(collRef, where(fieldName, ">=", fieldValue), where(fieldName, "<=", fieldValue + '\uf8ff'), orderBy("title"), orderBy("createdAt", "desc"), limit(fetchLimit))
              querySend(q, undefined, fieldValue);
            } else {
              if ( !isFeildArray ) {
                let q = query(collRef, where(fieldName, "==", fieldValue), limit(fetchLimit))
                querySend(q);
              } else {
                let q = query(collRef, where(fieldName, "array-contains", fieldValue), limit(fetchLimit))
                querySend(q);
              }
            }
          }
        }
      } else {
        if( !fieldName && !fieldValue ){
          if (category) {
            setFetchLoading(true);
            let q = query(collRef, where("category", "in", category), orderBy("createdAt", "desc"), startAfter(lastVisibleFetch), limit(fetchLimit));
            querySend(q, category);
          } else {
            let q = query(collRef);
            querySend(q);
          }
        } else {
          if(category) {
            if ( isSearch ) {
              setFetchLoading(true);
              let q = query(collRef, where("category", "in", category), where(fieldName, ">=", fieldValue), where(fieldName, "<=", fieldValue + '\uf8ff'), orderBy("title"), orderBy("createdAt", "desc"), startAfter(lastVisibleFetch), limit(fetchLimit));
              querySend(q, category);
            } else {
              setFetchLoading(true);
              let q = query(collRef, where("category", "in", category), where(fieldName, "array-contains", fieldValue), orderBy("createdAt", "desc"), startAfter(lastVisibleFetch), limit(fetchLimit));
              querySend(q, category);
            }
          } else {
            if ( isSearch ) {
              let q = query(collRef, where(fieldName, ">=", fieldValue), where(fieldName, "<=", fieldValue + '\uf8ff'), orderBy("title"), orderBy("createdAt", "desc"), startAfter(lastVisibleFetch), limit(fetchLimit))
              querySend(q, undefined, fieldValue);
            } else {
              if ( !isFeildArray ) {
                let q = query(collRef, where(fieldName, "==", fieldValue), limit(fetchLimit))
                querySend(q);
              } else {
                let q = query(collRef, where(fieldName, "array-contains", fieldValue), limit(fetchLimit))
                querySend(q);
              }
            }
          }
        }
      }
    }

    queryCalc(); // Init

  }

  return { fetchProducts, fetchMore, fetchLimit, fetchLoading, fetchEnded, productsData, productsLoading, productsLoadingFetch, productsError, isProductsEmpty }

}

export default useFetchProducts