// Essentials
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";

// Hooks
import useTabTitle from '../../../hooks/useTabTitle';
import useFetch from '../../../hooks/useFetch';
import useFetchProducts from '../../../hooks/useFetchProducts';

// Components
import TABMENU from '../../../components/tabMenu/TabMenu';
import ITEM from '../../../components/products/Item'

// Style
import "./Products.scss";


const PRODUCTS_WOMEN = () => {

    useTabTitle("Women's Selection");
    let navigate = useNavigate();


    // Category
    const { id: category } = useParams();    
    const { fetchProducts, fetchMore, fetchEnded, fetchLoading, productsData, productsLoading: loading, isProductsEmpty: empty } = useFetchProducts();

    useEffect(() => {
      let fetchLimit = 25;
      if(category){
        fetchProducts(fetchLimit, "subCategories", category, true, ["unisex", "women"]);
      } else {
        fetchProducts(fetchLimit, undefined, undefined, true, ["unisex", "women"]);
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
    const { data: tabMenuLinks, loading: tabMenuLinksLoading } = useFetch("categories", "women");
    const [tabMenu, setTabMenu] = useState();

    useEffect(() => {
        tabMenuLinks && setTabMenu(tabMenuLinks.subCategories)
    }, [tabMenuLinks]);

  return (
    <>
    <TABMENU title={"WOMEN"} links={tabMenu} loading={tabMenuLinksLoading}/>
    
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

export default PRODUCTS_WOMEN