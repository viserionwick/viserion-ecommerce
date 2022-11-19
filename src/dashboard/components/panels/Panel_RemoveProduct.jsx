// Essentials
import { useState } from "react";

// Firebase
import { db } from "../../../firebase/Config";
import { deleteDoc, doc } from "firebase/firestore";

// Contexts
import { useAuthContext } from "../../../contexts/Auth";
import { usePanelContext } from "../../../contexts/Panel";

// Hooks
import useFetchProducts from "../../../hooks/useFetchProducts";

// Style
import "./Panel_RemoveProduct.scss";

const PANEL_REMOVEPRODUCT = ({productId, products, setProducts}) => {

    // Update Products
    const { setProductsData } = useFetchProducts();

    // Panel Context
    const { closePanel } = usePanelContext();

    // States
    const [loading, setLoading] = useState(false);

    const onRemove = () => { 
        setLoading(true);

        deleteDoc(doc(db, "products", productId))
        .then(() => {
          let newProducts = [...products].filter(product => product.productId !== productId);

          setProducts(newProducts);
          setProductsData(newProducts);

          closePanel();
          setLoading(false);
        })
        .catch(() => {
          closePanel();
          setLoading(false);
        })
      } 

    const onCancel = () => {
        closePanel();
    }

  return (
    <div className="p-productRemove">
        {
            !loading ?
            <>
                <p>Are you sure that you want to remove this product from the store? You won't be able to reverse this removal.</p>
                <div className="buttons">
                    <button onClick={onRemove} className="buttonS2">Remove</button>
                    <button onClick={onCancel} className="buttonS1">Cancel</button>
                </div>
            </>
            :
            <div className="loading">
                <span className='loadingS1'/>
            </div>
        }
    </div>
  )
}

export default PANEL_REMOVEPRODUCT