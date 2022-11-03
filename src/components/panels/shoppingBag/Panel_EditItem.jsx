// Essentials
import { useEffect, useRef, useState } from "react";

// Contexts
import { usePanelContext } from "../../../contexts/Panel";

// Hooks
import useFetchProducts from "../../../hooks/useFetchProducts";

// Style
import "./Panel_EditItem.scss";


// Jotai
import { useAtom } from "jotai";

// GLOBAL STATE
import { shoppingBagList_atom } from "../../../pages/bag/Page_ShoppingBag";

const PANEL_EDITITEM = ({itemProductId, itemIndex}) => {

  // itemID: needed to get data form db and manipulate.
  // itemIndex: needed to place data in correct order in the shopping bag

  

  const { closePanel } = usePanelContext();

  // GLOBAL STATES
  const [shoppingBagList, setShoppingBagList] = useAtom(shoppingBagList_atom);
  
  // States
  const [product, setProduct] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [chooseColor, setChooseColor] = useState();
  const [chooseSize, setChooseSize] = useState();
  const [preOrderDate, setPreOrderDate] = useState();
  const [itemStatus, setItemStatus] = useState();

  /* useEffect(() => {
    let list = [];
    setShoppingBagList(list);
  }, []);
 */
  // Fetch Item
  const { fetchProducts, productsData } = useFetchProducts(); 

  useEffect(() => {
    fetchProducts(1, "productId", itemProductId, false)
  }, []);
  

  // Set Product
  useEffect(() => {
    if (productsData) {
      setProduct(productsData[0]);
      if(product) {
        let items = [...shoppingBagList]
        setItemToEdit(items.filter( item => item.productId === itemProductId )[0]);
        if (itemToEdit) {
          setChooseSize(itemToEdit.size);
          setChooseColor(itemToEdit.color);
          setItemStatus(itemToEdit.status);
        }
      } 
    }
  }, [productsData, product, itemToEdit]);

  useEffect(() => {
    if (chooseSize) {
      if (chooseSize !== "selectSizeDefault" && product.sizes[chooseSize].preOrderDate) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
        const date = product.sizes[chooseSize].preOrderDate.toDate();
        setPreOrderDate(monthNames[date.getMonth()] +" "+ date.getDate() +", "+ date.getFullYear());

        setItemStatus(2);
      } else {
        setPreOrderDate();
        setItemStatus(1);
      }
    }
  }, [chooseSize]);
  
  // Handle Form: Errors
  const [chooseColorError, setChooseColorError] = useState("");
  const [chooseSizeError, setChooseSizeError] = useState("");

  // Handle Submit Edit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check Color
    let isColor = false;
    if (chooseColor === undefined) {
      isColor = false;
      setChooseColorError("panel_editItem--error");
    }else { isColor = true; }
    
    // Check Size
    let isSize = false;
    if (chooseSize === "selectSizeDefault" || chooseSize === undefined){
      isSize = false;
      setChooseSizeError("panel_editItem--error");
    }else { isSize = true; }
    
    
    // Check Status
    if (isColor && isSize) {
      let formData = {};

      itemStatus !== 2 ? 
      formData = {
        productId: product.productId,
        title: product.title,
        url: product.url,
        maxQuantity: product.maxQuantity,
        image: product.images[chooseColor][0],
        quantity: itemToEdit.quantity,
        basePrice: product.basePrice,
        size: chooseSize,
        color: chooseColor,
        status: itemStatus
      } 
      :
      formData = {
        productId: product.productId,
        title: product.title,
        url: product.url,
        maxQuantity: product.maxQuantity,
        image: product.images[chooseColor][0],
        quantity: itemToEdit.quantity,
        basePrice: product.basePrice,
        size: chooseSize,
        color: chooseColor,
        status: itemStatus,
        preOrderDate: product.sizes[chooseSize].preOrderDate
      }
       
      // Add To The Shopping Bag List
      let newShoppingBagList = [...shoppingBagList];
      
      newShoppingBagList[itemIndex] = formData;

      setShoppingBagList(newShoppingBagList);

      closePanel();
    }
  }

  // Handle Choose
  const handleChoose = (e) => {
    const { name, value } = e.target;
    
    if (product) {
      if (name === "chooseColor") {
        setChooseColor(value);
        setChooseColorError("");
      }
      if (name === "chooseSize") {
        setChooseSize(value);
        setChooseColor();
        if(value !== "selectSizeDefault"){
          setChooseSizeError("");
        }else {
          setChooseSizeError("panel_editItem--error"); 
        }
      }
    }
  }

  // Set Uniques
  const [allUniqueColors, setAllUniqueColors] = useState([]);
  
  useEffect(() => {
    // Colors
    let allColors = [];

    product && Object.keys(product.sizes).map(size => (
        product.sizes[size].colors.map(color => (
            allColors = [...allColors, color]
        ))
    ));

    let uniqueColors = allColors.filter((val, id, array) => array.indexOf(val) === id);
    setAllUniqueColors(uniqueColors);
    
    let defaultColor = allUniqueColors[0];
    setChooseColor(defaultColor);
  }, [product]);


  // Render: Size Options
  const renderSizeStatus = (param) => {
    switch (param) {
    case 0:
        return " (Out of stock)";
    case 1:
        return "";
    case 2:
        return " (Pre-order)";
    case 3:
        return " (Notify me)";
    
    default:
        break;
    }
  }



  // Choose Color Scroll
  const contentWrapper = useRef();
  const contentScroller = useRef();
  const contentChild = useRef();

  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    if (contentWrapper.current && contentChild.current) {
      let childrenWidth = 0;
      
      for (let i = 0; i < contentChild.current.childNodes.length; i++) {
        const child = contentChild.current.childNodes[i];
        const style = getComputedStyle(child);
        
        childrenWidth = childrenWidth + (child.offsetWidth + parseInt(style.marginLeft) + parseInt(style.marginRight) + parseInt(style.marginTop) + parseInt(style.marginBottom));
      }

      const updateSize = () => {
        let currentWidth = contentWrapper.current.clientWidth;

        if (childrenWidth > currentWidth) {
          setScrollable(true);
        }
        else {
          setScrollable(false);
        }
      }

      updateSize();
      window.addEventListener('resize', updateSize);
      

      return () => window.removeEventListener('resize', updateSize);
    }
  }, [contentWrapper.current, contentChild.current]);
  
  // Choose Color Scroll: Button States
  const [goLeft, setGoLeft] = useState(false);
  const [goRight, setGoRight] = useState(false);

  if (scrollable) {

    contentScroller.current.onscroll = () => {
      let position = contentScroller.current.scrollLeft;
      let max = contentScroller.current.scrollWidth - contentScroller.current.clientWidth;

      if (position < 1) { // Limit of Left
        setGoLeft(false);
        setGoRight(true);
        contentScroller.current.scrollLeft = 0;
      }
      else if (position >= max) { // Limit of Right
        setGoLeft(true);
        setGoRight(false);
        contentScroller.current.scrollLeft = max;
      }
      else {
        setGoLeft(true);
        setGoRight(true);
      }
    }
    
  }

  // Choose Color Scroll: Button Functions
  const scrollJump = 50;
  const onLeft = () => {
    contentScroller.current.scrollLeft -= scrollJump;
  }
  const onRight = () => {
    contentScroller.current.scrollLeft += scrollJump;
  }

  // Choose Color Scroll: Initial Position
  useEffect(() => {
    if (scrollable) {
      let position = contentScroller.current.scrollLeft;
      let max = contentScroller.current.scrollWidth - contentScroller.current.clientWidth;

      if (position < 1) { // Limit of Left
        setGoLeft(false);
        setGoRight(true);
      }
      else if (position === max) { // Limit of Right
        setGoLeft(true);
        setGoRight(false);
      }
      else {
        setGoLeft(true);
        setGoRight(true);
      }
    }
  }, [scrollable]);


  return (
    <>
      {
        product ?
        <form onSubmit={handleSubmit} className="panel_editItem formS1">
          <h1 className="panel_editItem--title">CROPPED TUXEDO BLAZER TUXEDO BLAZER</h1>
          {
            preOrderDate &&
            <h5>Pre Order Date: {preOrderDate}</h5>
          }
          <div className="panel_editItem--choose">
            <div className="panel_editItem--chooseSize">
              <label htmlFor="chooseSize" className={`${chooseSizeError} fInput--select`}>
                <span>Size</span>
                <select name="chooseSize" id="chooseSize" value={chooseSize} onChange={handleChoose}>
                  <option value="selectSizeDefault">Select Size</option>
                  {
                    Object.keys(product.sizes).map((size, i) => (
                    product.sizes[size].status !== 0 &&
                    product.sizes[size].status !== 3 &&
                    <option value={size} key={i}>
                    {
                        size
                        + " " + 
                        renderSizeStatus(product.sizes[size].status)
                    }
                    </option>
                    ))
                }
                </select>
              </label>
            </div>
            <div className="panel_editItem--chooseColor">
              <label htmlFor="chooseColor" className={`${chooseColorError} fInput--select`}>
                <span>Color</span>
                <div className="chooseColorWrapper" ref={contentWrapper}>
                  <button className={`chooseColor--goLeft ${!goLeft ? "deleteMe" : ""}`} onClick={onLeft}><i className="fa-solid fa-chevron-left"></i></button>
                  <div className="chooseColorContent" ref={contentScroller}>
                    <div className="chooseColorBalls" ref={contentChild}>
                      {
                        chooseSize === "selectSizeDefault" || chooseSize === undefined ?
                        allUniqueColors && allUniqueColors.map((color, i) => (
                        <label htmlFor={color} key={i}>
                          <input
                            type="radio"
                            name="chooseColor"
                            id={color}
                            value={color}
                            checked={chooseColor === color}
                            onChange={handleChoose}
                          />
                          <span style={{background: color}} />
                        </label>
                        ))
                        :
                        product.sizes[chooseSize].colors.length === 0 ?
                        <h4>Out of Stock</h4>
                        :
                        product.sizes[chooseSize].colors.map((color, i) => (
                        <label htmlFor={color} key={i}>
                        <input
                          type="radio"
                          name="chooseColor"
                          id={color}
                          value={color}
                          checked={chooseColor === color}
                          onChange={handleChoose}
                        />
                        <span style={{background: color}} />
                        </label>
                        ))
                    }
                    </div>
                  </div>
                  <button className={`chooseColor--goRight ${!goRight ? "deleteMe" : ""}`} onClick={onRight}><i className="fa-solid fa-chevron-right"></i></button>
                </div>
              </label>
            </div>
          </div>
          <div className="panel_editItem--buttons">
            <button type="submit" className="buttonS2">Save</button>
            <button type="button" onClick={closePanel} className="buttonS1">Cancel</button>
          </div>
        </form>
        :
        <div className="loadingZone_">
          <span className="loadingS1" />
        </div>
      }
    </>
  )
}

export default PANEL_EDITITEM