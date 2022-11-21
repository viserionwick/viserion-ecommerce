// Essentials
import { useEffect, useState } from "react";

// Firebase
import { db } from '../firebase/Config';
import { collection, getDocs, query, where, limit, startAfter, orderBy } from 'firebase/firestore';

const useFetchProducts = (isFunc = true, fetchLimit, fieldName = false, fieldValue, isFeildArray = false, category = null, explore = false, isSearch = false) => {

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
      fetchProducts(fetchLimit, fieldName, fieldValue, isFeildArray, category, explore, isSearch)
    }
    
  }, [ fieldName, fieldValue, isFeildArray, isSearch ])
  
  const fetchProducts = (fetchLimit, fieldName = false, fieldValue, isFeildArray = false, category = null, explore = false, isSearch = false) => {
    let oldCategory = null;
    let oldSearch = null;
    let oldFetch = 0;


    const collRef = collection(db, "products");
    setProductsLoading(true);
    setProductsLoadingFetch(true);

    const querySend = (q, newCategory = null, newSearch = fieldValue) => {

      const dataCalc = (snapshot, data) => {
        let newFetch = 1;

        if (data) {
          if(data.length !== 0){ // if data found
            if(!isSearch) {
              if (oldCategory !== newCategory) { // new category
                setProductsData(data);
                oldCategory = newCategory;
              } else { // same category
                if (fieldName) { 
                  setProductsData(prevState => (
                    [ ...prevState, ...data]
                  )) 
                } else {
                  if (!category) {  // get all products
                    if (oldFetch === newFetch) {
                      setProductsData(prevState => (
                        [ ...prevState, ...data]
                      ))
                    } else {
                      setProductsData(data);
                      oldFetch = newFetch;
                    }
                  } else {
                    setProductsData(prevState => (
                      [ ...prevState, ...data]
                    )) 
                  }
                }
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

          } else{ // if no data found
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
      }


      // Init
      getDocs(q)
        .then((snapshot) => {
          const data = snapshot.docs.map((doc) => (
            {...doc.data(), id: doc.id}
          ));
          data && dataCalc(snapshot, data);
        })
        .catch((err) => {
          setProductsError(err);
          setProductsData(null);
          setProductsLoading(false);
          setProductsLoadingFetch(false);
          setFetchLoading(false);
          setIsProductsEmpty(true);
        });
    }



    const queryCalc = (lastVisibleFetch) => {
      setFetchLoading(true);
      if(!lastVisibleFetch) {
        if( !fieldName && !fieldValue ){
          if (category) {
            let q = !explore ?
            query(collRef, where("category", "in", category), orderBy("createdAt", "desc"), limit(fetchLimit))
            :
            query(collRef, where("category", "in", category), where("subCategories", "array-contains", "explorePage"), orderBy("createdAt", "desc"), limit(fetchLimit));

            querySend(q, category);
          } else {
            let q = query(collRef, orderBy("createdAt", "desc"), limit(fetchLimit));
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
            let q = query(collRef, where("category", "in", category), orderBy("createdAt", "desc"), startAfter(lastVisibleFetch), limit(fetchLimit));
            querySend(q, category);
          } else {
            let q = query(collRef, orderBy("createdAt", "desc"), startAfter(lastVisibleFetch), limit(fetchLimit));
            querySend(q);
          }
        } else {
          if(category) {
            if ( isSearch ) {
              let q = query(collRef, where("category", "in", category), where(fieldName, ">=", fieldValue), where(fieldName, "<=", fieldValue + '\uf8ff'), orderBy("title"), orderBy("createdAt", "desc"), startAfter(lastVisibleFetch), limit(fetchLimit));
              querySend(q, category);
            } else {
              let q = query(collRef, where("category", "in", category), where(fieldName, "array-contains", fieldValue), orderBy("createdAt", "desc"), startAfter(lastVisibleFetch), limit(fetchLimit));
              querySend(q, category);
            }
          } else {
            if ( isSearch ) {
              let q = query(collRef, where(fieldName, ">=", fieldValue), where(fieldName, "<=", fieldValue + '\uf8ff'), orderBy("title"), orderBy("createdAt", "desc"), startAfter(lastVisibleFetch), limit(fetchLimit))
              querySend(q, undefined, fieldValue);
            } else {
              if ( !isFeildArray ) {
                let q = query(collRef, where(fieldName, "==", fieldValue), startAfter(lastVisibleFetch), limit(fetchLimit))
                querySend(q);
              } else {
                let q = query(collRef, where(fieldName, "array-contains", fieldValue), startAfter(lastVisibleFetch), limit(fetchLimit))
                querySend(q);
              }
            }
          }
        }
      }
    }

    queryCalc(); // Init

  }

  return { fetchProducts, fetchMore, fetchLimit, fetchLoading, fetchEnded, productsData, setProductsData, productsLoading, productsLoadingFetch, productsError, isProductsEmpty }

}

export default useFetchProducts