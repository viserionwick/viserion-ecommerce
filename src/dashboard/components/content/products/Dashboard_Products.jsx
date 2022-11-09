// Essentials
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Firebase
import { db } from "../../../../firebase/Config";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";

// Contexts
import { useAuthContext } from "../../../../contexts/Auth";
import { usePanelContext } from "../../../../contexts/Panel";

// Hooks
import useFetchProducts from "../../../../hooks/useFetchProducts";

// Style
import "./Dashboard_Products.scss"

const DASHBOARD_PRODUCTS = () => {

  // Read User Permissions
  const { userRoleAccess } = useAuthContext();

  // Fetch Products
  const { fetchProducts, fetchMore, productsData: products, fetchEnded, fetchLoading } = useFetchProducts();
  useEffect(() => {
    fetchProducts(10);
  }, []);


  // Panel Context
  const { panel_Agreement, closePanel } = usePanelContext();
  

  const [formData, setFormData] = useState({
    createdAt: new Date(),
    title: "DESTROYED TURTLENECK SWEATER IN BLACK",
    description: "Destroyed Turtleneck Sweater in black viscose devore rib knit is from the look 4 of the Balenciaga's Winter 22 Collection, 360° Show.",
    materials: "90% viscose, 10% lycra",
    details: ["Viscose devore rib knit", "This item is unisex", "Oversize fit", "High neck", "Long sleeves", "Destroyed allover the fabric", "Made in Italy", "Dry cleaning", "Model is wearing a size 4"],

    images: {
      "#1c1c1e": ["https://firebasestorage.googleapis.com/v0/b/balenciaga-mockup.appspot.com/o/products%2FPzORqlpHCoOZSh3xYFnV%2Fimages%2F%235e5b58%2F1.jpg?alt=media&token=5683edc5-85a6-4cee-8d22-c9d6729f1595"],
      baseImagesColor: "#1c1c1e"
    },
    sizes: {
        "1": {
          status: 1,
          colors: [
            "#1c1c1e"
          ]
        },
        "2": {
          status: 1,
          colors: [
            "#1c1c1e"
          ]
        },
        "3": {
          status: 1,
          colors: [
            "#1c1c1e"
          ]
        },
        "4": {
          status: 0,
          colors: [
            "#1c1c1e"
          ]
        }
    },

    category: "unisex",
    subCategories: ["knitwear"],
    
    maxQuantity: 4,
    baseStatus: 1,
    basePrice: 1950
  });


  

  const handleSubmit = (e) => {
    e.preventDefault();
    const regex = /\s{2,}/g;
    
    const makeUrl = (input) => {
      const regexUrl = /[a-zA-Z]+/g;
      let step = "";
  
      input.match(regexUrl).map(word => {
        step = step + "-" + word.toLowerCase()
      })

      return step.substring(1) +"-"+ Math.floor(Math.random() * 1000000+1);
    }



    const newFormData = {
      createdAt: formData.createdAt,
      title: formData.title.replace(regex, ' ').trim(),
      url: makeUrl(formData.title),
      description: formData.description.replace(regex, ' ').trim(),
      materials: formData.materials,
      details: formData.details,

      images: formData.images,
      sizes: formData.sizes,

      category: formData.category,
      subCategories: formData.subCategories,

      maxQuantity: formData.maxQuantity,
      baseStatus: formData.baseStatus,
      basePrice: formData.basePrice
    }

    
    // Add The Order
    console.log(newFormData);

    /* addDoc(collection(db, "products"), newFormData)
    .then((docRef) => {
        updateDoc(docRef, {
          productId: docRef.id
        })
    }) */
  }


  // Render: Status Label
  const renderStatusLabel = (product) => {
    const preOrderDate = product.preOrderDate;

    // Status Label
    let allStatuses = [];

    product && Object.keys(product.sizes).map(size => (
        allStatuses = [...allStatuses, product.sizes[size].status]
    ))

    let uniqueStatuses = allStatuses.filter((val, id, array) => array.indexOf(val) === id);

    if (uniqueStatuses.length === 1) {
              
      switch (uniqueStatuses[0]) {
        case 0:
          return <div className="dashboard-products__list--item__details__status status0">OUT OF STOCK</div>;
        case 1:
            return <div className="dashboard-products__list--item__details__status status1">IN STOCK</div>;
        case 2:
            return preOrderDate ? <div className="dashboard-products__list--item__details__status status2">PRE-ORDER: {preOrderDate}</div> : null;
        case 3:
            return <div className="dashboard-products__list--item__details__status status3">SCHEDULED</div>
          
        default:
            break;
        }
        
    }
    else {
      if (uniqueStatuses.includes(1)) {
        return <div className="dashboard-products__list--item__details__status status1">IN STOCK</div>
      } else {
        return <div className="dashboard-products__list--item__details__status status3">NOT OCCURRENT</div>
      }
    }
  }

  // Render: All Unique Colors
  const renderUniqueColors = (product) => {
    let allColors = [];

    product && Object.keys(product.sizes).map(size => (
        product.sizes[size].colors && product.sizes[size].colors.map(color => (
            allColors = [...allColors, color]
        ))
    ));

    let allUniqueColors = allColors.filter((val, id, array) => array.indexOf(val) === id);

    return allUniqueColors.map((color, i) => (
      <span style={{background: color}} key={i} />
    ));
  }

  // Render: Sizes
  const renderSizes = (product) => {
    return Object.keys(product.sizes).map((size, i) => (
      product.sizes[size].status !== 0 ?
        <span key={i}>
          { size }
        </span>
        : /* Make "out of stock" spans gray */
        <span style={{color: "gray"}} key={i}>
          { size }
        </span>
    ))
  }
  


  // Function: Edit Product
  const onEdit = (productId) => {
    console.log("edit: " + productId);
  }

  // Function: Remove Product
  const onRemove = (productId) => {
    console.log("remove: " + productId);

    const onAgree = () => {
      console.log("removed");
      closePanel();
    }

    const onCancel = () => {
      console.log("cancelled");
      closePanel();
    }

    panel_Agreement("Remove Product", "Are you sure you want to remove this product from the store? You won't be able to reverse this removal.", "Remove", "Cancel", onAgree, onCancel);
  }


  return (
    <div className="dashboard-products">
      <h1>Manage Products</h1>

      { 
        userRoleAccess.products === "all" || userRoleAccess.products.includes("add") ?

        <div className="dashboard-products__addProduct">
          <button type='submit' className=" buttonS2">ADD A NEW PRODUCT</button>
        </div>

        : <></>
      }

      { 
        userRoleAccess.products && products.length > 0 ?
        <>
        <h3 className="dashboard-products__title">Recently Added</h3>

        <div className="dashboard-products__list">
          {
            products.map((product, i) => (
            <div className="dashboard-products__list--item" key={i}>
              <a href={"/product/" + product.url} target="_blank" className="dashboard-products__list--item__picture buttonClear">
                <img src={ product.images[product.images.baseImagesColor][0] } alt="item_image" />
              </a>

              <div className="dashboard-products__list--item__details">
                <div className="dashboard-products__list--item__details--tags">
                  <div>
                    <div className="dashboard-products__list--item__details__totalPrice">
                      $ { product.basePrice }
                    </div>
                    <div className="dashboard-products__list--item__details__category">
                      { product.category }
                    </div>

                    { renderStatusLabel(product) }
                    
                    {
                      product.subCategories.includes("explorePage") &&
                      <div className="dashboard-products__list--item__details__explore">
                        EXPLORE PAGE
                      </div>
                    }
                  </div>
                  <a href={"/product/" + product.url} target="_blank" className='dashboard-products__list--item__details__title buttonClear'>
                    { product.title }
                  </a>
                </div>

                <div className="dashboard-products__list--item__details--features">
                  <div className="sizes">
                    { renderSizes(product) }
                  </div>
                  <div className="colors">
                    { renderUniqueColors(product) }
                  </div>
                </div>
                
              </div>

              {
                userRoleAccess.products === "all" || userRoleAccess.products.includes("edit") || userRoleAccess.products.includes("remove") ?
                <div className="dashboard-products__list--item__details--buttons">
                {
                  userRoleAccess.products === "all" || userRoleAccess.products.includes("edit") ?
                  <button className='p-shoppingBag__list--item--details__editButton buttonS2' onClick={() => onEdit(product.productId)}> EDIT </button>
                  : <></>
                }

                {
                  userRoleAccess.products === "all" || userRoleAccess.products.includes("remove") ?
                  <button className='p-shoppingBag__list--item--details__removeButton buttonS1' onClick={() => onRemove(product.productId)}> REMOVE </button>
                  : <></>
                }
                </div>
                : <></>
              }
              
            </div>
            ))
          }
        </div>

        {
          !fetchEnded ?
            <div className="dashboard-products__fetchMore">
              {
                !fetchLoading ? 
                <button onClick={fetchMore} className="showMore buttonS2">Show More</button>
                :
                <button className="showMore buttonS2" disabled>Loading...</button>
              }
            </div>
          :
          <></>
        }
        </>

        : // Loading
        <div className='loadingZone'>
            <span className='loadingS1'/>
        </div>
      }
    </div>
  )
}

export default DASHBOARD_PRODUCTS