// Essentials
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

// Hooks
import useTabTitle from '../../../hooks/useTabTitle';
import useFetch from '../../../hooks/useFetch';
import useFetchProducts from '../../../hooks/useFetchProducts';

// Components
import TABMENU from '../../../components/tabMenu/TabMenu';
import ITEM from '../../../components/products/Item'

// Style
import "./Products.scss";


const PRODUCTS_EXPLORE = () => {

    useTabTitle("Explore");


    // Category
    const { id: category } = useParams();    
    const { fetchProducts, fetchMore, fetchEnded, fetchLoading, productsData, productsLoading: loading, isProductsEmpty: empty } = useFetchProducts();

    useEffect(() => {
      let fetchLimit = 25;
      if(category){
        fetchProducts(fetchLimit, "subCategories", category, true, ["unisex", "men", "women"], true);
        fetchProducts(fetchLimit, "subCategories", category, true, ["unisex", "men", "women"], true);
      } else {
        fetchProducts(fetchLimit, undefined, undefined, true, ["unisex", "men", "women"], true);
      }
    }, [category]);


    // States
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (productsData) {
          let newProducts = [...productsData];

          setProducts(newProducts);
        }
    }, [productsData]);
    
    

    // Tab Menu
    const { data: tabMenuLinks, loading: tabMenuLinksLoading } = useFetch("categories", "explore");
    const [tabMenu, setTabMenu] = useState();

    useEffect(() => {
        tabMenuLinks && setTabMenu(tabMenuLinks.subCategories)
    }, [tabMenuLinks]);

  return (
    <>
    <TABMENU title={"EXPLORE"} links={tabMenu} loading={tabMenuLinksLoading}/>
    
    <div className="productsWrapper">
        {
          !loading ?
            !empty ?
              <>
              <div className="products">
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
            <div className='loadingZone'>
                <span>Sorry, no products have been found in this category.</span>
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

export default PRODUCTS_EXPLORE