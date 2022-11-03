// Essentials
import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// Hooks
import useFetchProducts from "../../hooks/useFetchProducts";
import useTabTitle from "../../hooks/useTabTitle";

// Components
import TABMENU from "../../components/tabMenu/TabMenu";
import ITEM from "../../components/products/Item";

// Styles
import "./Page_Search.scss"

const PAGE_SEARCH = () => {

  // Tab Title
  const { setTabTitle } = useTabTitle();

  // Navigate to Query
  let navigate = useNavigate();

  // Search: Fetch Products
  const { fetchProducts, fetchMore, fetchEnded, fetchLoading, productsData: products, productsLoading: loading, isProductsEmpty: empty } = useFetchProducts();

  // Search: Ref
  const searchBox = useRef();

  // Search: Params
  const [searchParams] = useSearchParams();

  // Search: States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryBox, setSearchQueryBox] = useState("");

  // Search: Handle & Submit
  const searchBoxHandle = (e) => {
    const { value } = e.target;

    setSearchQueryBox(value);  
  }
  
  const searchBoxSubmit = (e) => {
    e.preventDefault();
    const regex = /\s{2,}/g;
    
    setSearchQuery(searchQueryBox.replace(regex, ' ').trim());
    navigate("/search?q="+searchQueryBox.replace(regex, ' ').trim());
    
    setSearchQueryBox(searchQueryBox.replace(regex, ' ').trim());
    searchBox.current.blur();
    window.scroll(0, 0);
  }


  // Search: Update
  useEffect(() => {
    let query = searchParams.get("q");

    if (query){
      setSearchQuery(query);
      setSearchQueryBox(query);
      
      setTabTitle(`Search: "${query}"`);

      fetchProducts(25, "title", query, undefined, undefined, undefined, true);
    }

  }, [searchParams, setTabTitle]);
  

  return (
    <>
      <TABMENU title="Search" element={
        <form onSubmit={searchBoxSubmit} className='p-search__searchBar formS1' >
          <input
              type="text"
              name='search'
              id='searchBox'
              className='fInput'
              value={searchQueryBox}
              onChange={searchBoxHandle}
              autoComplete="off"
              spellCheck="false"
              ref={searchBox}
            />
          <button className="buttonClear"><i className="fa-solid fa-magnifying-glass"></i></button>
        </form>
      } />
      
      <div className="p-search">
        {
          !loading ?
            !empty ?
              <>
              <div className="p-search__results">
              {
                products && 
                products.map((product, i) => (
                    <ITEM
                        key={i}
                        title={product.title && product.title}
                        price={product.basePrice && product.basePrice}
                        images={product.images && product.images[product.images.baseImagesColor]}
                        status={product.baseStatus && product.baseStatus}
                        url={product.url && product.url}
                    />
                ))
              } 
              </div>
              {
                !fetchEnded ?
                !fetchLoading ? 
                <button onClick={fetchMore} className="showMore buttonS2">Show More</button>
                :
                <button className="showMore buttonS2" disabled>Loading...</button>
                :
                <></>
              }
              </>
            : // empty
            <div className="p-search__results--error">
            Sorry, no results for "{searchQuery}", please try again differently.
            </div>
          : // loading
          <div className='loadingZone'>
            <span className='loadingS1'/>
          </div>
        }
      </div>
    </>
  )
}

export default PAGE_SEARCH;