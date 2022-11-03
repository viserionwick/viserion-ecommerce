// Essentials
import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

// Contexts
import { usePanelContext } from '../../contexts/Panel';

// Hooks
import useFetchProducts from '../../hooks/useFetchProducts';
import useTabTitle from '../../hooks/useTabTitle';
import useScrollEffect from '../../hooks/useScrollEffect';

// Components
import PANEL_SIZEGUIDE from '../../components/panels/product/Panel_SizeGuide';
import PANEL_MAILINGLIST from '../../components/panels/mailing_list/Panel_MailingList';
import PAGE_NOTFOUND from '../404/Page_NotFound';

// Style
import "./Page_Product.scss";


// Jotai
import { useAtom } from 'jotai';

// GLOBAL STATES
import { shoppingBagList_atom } from '../bag/Page_ShoppingBag';
import { toggleBag_atom } from '../../layout/Header';

function PAGE_PRODUCT() {

    const navigate = useNavigate();

    // Fetch Product
    const { id: productURL } = useParams();
    const { fetchProducts, productsData, isProductsEmpty: empty } = useFetchProducts();

    useEffect(() => {
        if (productURL) {
            fetchProducts(1, "url", productURL);
        }
    }, [productURL]);

    const [product, setProduct] = useState(null);
    useEffect(() => {
        productsData && setProduct(productsData[0]);
    }, [productsData]);
    

    // Tab Title
    useTabTitle(product && product.title);


    // Scroll Effect
    const { styleOnScroll } = useScrollEffect();

    const productHeader = useRef();
    const productHeaderWrapper = useRef();

    const onScrollDown = {
        top: "5px"
    }
    const onScrollUp = {
        top: "50px"
    }
    
    styleOnScroll([productHeader, productHeaderWrapper], onScrollUp, onScrollDown);


    // PANEL CONTEXT
    const { showPanel, closePanel, panel_Agreement} = usePanelContext();


    // PANEL CONTEXT: Show Size Guide
    const showSizeGuide = () => {
        showPanel(<PANEL_SIZEGUIDE />, "Size Guide");
    }

    // PANEL CONTEXT: Notify Panel
    const mailingList = () => {
        showPanel(<PANEL_MAILINGLIST />, "Notify me when available");
    }



    // Render the default of Submit Button and Status Label
    const [submitButtonStatus, setSubmitButtonStatus] = useState(1);
    const [statusLabelStatus, setStatusLabelStatus] = useState();
    const [preOrderDate, setPreOrderDate] = useState();
    
    
    // Handle Form: Set all unique colors & Set the first color as default color
    const [allUniqueColors, setAllUniqueColors] = useState([]);

    useEffect(() => {
        // Colors
        let allColors = [];

        product && Object.keys(product.sizes).map(size => (
            product.sizes[size].colors && product.sizes[size].colors.map(color => (
                allColors = [...allColors, color]
            ))
        ));

        let uniqueColors = allColors.filter((val, id, array) => array.indexOf(val) === id);
        setAllUniqueColors(uniqueColors);
        
        let defaultColor = allUniqueColors[0];
        setChooseColor(defaultColor);



        // Status Label
        let allStatuses = [];

        product && Object.keys(product.sizes).map(size => (
            allStatuses = [...allStatuses, product.sizes[size].status]
        ))

        
        let uniqueStatuses = allStatuses.filter((val, id, array) => array.indexOf(val) === id);
        
        if (uniqueStatuses.length === 1) {
            
            switch (uniqueStatuses[0]) {
                case 0:
                    return setStatusLabelStatus(0);
                case 1:
                    return setStatusLabelStatus(1);
                case 2:
                    return setStatusLabelStatus(2);
                case 3:
                    return setStatusLabelStatus(3);
                
                default:
                    break;
                }
            
        }
        else {
            setStatusLabelStatus(1)
        }
        
    }, [product]);


    
    // Handle Form: Choose
    const [chooseColor, setChooseColor] = useState();
    const [chooseSize, setChooseSize] = useState(); 

    const handleChoose = (e) => {
        const { name, value } = e.target;
        
        if (product) {
            if (name === "selectColor") {
                setChooseColor(value);
                setChooseColorError("");
            }
            if (name === "selectSize") {
                setChooseSize(value);
                setChooseColor();
                if(value !== "selectSizeDefault"){
                    setSubmitButtonStatus(product.sizes[value].status);
                    setStatusLabelStatus(product.sizes[value].status);

                    if (product.sizes[value].preOrderDate) {
                        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
                        const date = product.sizes[value].preOrderDate.toDate();
                        setPreOrderDate(monthNames[date.getMonth()] +" "+ date.getDate() +", "+ date.getFullYear());
                    } else {
                        setPreOrderDate();
                    }

                    setChooseSizeError("");
                }else {
                    setStatusLabelStatus(1);
                    setChooseSizeError("product__details--error");
                }
            }
        }
    }

    // Handle Form: Errors
    const [chooseColorError, setChooseColorError] = useState("");
    const [chooseSizeError, setChooseSizeError] = useState("");
    
    // Handle Submit
    const [shoppingBagList, setShoppingBagList] = useAtom(shoppingBagList_atom);
    const [toggleBag, setToggleBag] = useAtom(toggleBag_atom);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check Color
        let isColor = false;
        if (chooseColor === undefined) {
            isColor = false;
            setChooseColorError("product__details--error");
        }else { isColor = true; }
        
        // Check Size
        let isSize = false;
        if (chooseSize === "selectSizeDefault" || chooseSize === undefined){
            isSize = false;
            setChooseSizeError("product__details--error");
        }else { isSize = true; }
        
        
        // Check Status
        if (isColor && isSize) {
            let formData = {};

            statusLabelStatus !== 2 ? 
            formData = {
                productId: product.productId,
                title: product.title,
                url: product.url,
                image: product.images[chooseColor][0],
                size: chooseSize,
                color: chooseColor,
                status: statusLabelStatus,
                quantity: 1,
                maxQuantity: product.maxQuantity,
                basePrice: product.basePrice
            } 
            :
            formData = {
                productId: product.productId,
                title: product.title,
                url: product.url,
                image: product.images[chooseColor][0],
                size: chooseSize,
                color: chooseColor,
                status: statusLabelStatus,
                preOrderDate: product.sizes[chooseSize].preOrderDate,
                quantity: 1,
                maxQuantity: product.maxQuantity,
                basePrice: product.basePrice
            }

            // Add To The Shopping Bag List
            let newShoppingBagList = [...shoppingBagList];

            // Check if added already
            if (newShoppingBagList.filter(item => item.productId === formData.productId).length === 0) {
                newShoppingBagList = [...newShoppingBagList, formData];

                setShoppingBagList(newShoppingBagList);
                setToggleBag(true);
            } else {
                const content = <p style={{textAlign: "center"}}>This item is already added to your shopping bag. <br/> <br/> You can always edit your items from shopping bag.</p>;
                const onView = () => {
                    navigate("/bag");
                    closePanel();
                }

                panel_Agreement("Already Added", content, "View Shopping Bag", "Cancel", onView, closePanel);
            }

        }

    }
    

    // Render: Submit Button
    const renderSubmitButton = (status) => {

        const classNames = "product__details--action fColumn buttonClear";

        switch (status) {
        case 0:
            return <Link to="/contact" className={`${classNames} gray`}><span>Contact Us</span></Link>;
        case 1:
            return <button type='submit' className={`${classNames} green`}><span>Add To Bag</span></button>;
        case 2:
            return <button type='submit' className={`${classNames} green`}><span>Pre-Order</span></button>;
        case 3:
            return <button type='button' onClick={mailingList} className={`${classNames} gray`}><span>Notify Me</span></button>;
        
        default:
            break;
        }
    }


    // Render: Status Label
    const renderStatusLabel = (status) => {
        const classNames = "product__details--status";

        switch (status) {
        case 0:
            return <h6 className={classNames}>Out Of Stock</h6>;
        case 1:
            return null;
        case 2:
            return preOrderDate ? <h6 className={classNames}>Available on: {preOrderDate}</h6> : null;
        case 3:
            return <h6 className={classNames}>Coming Soon</h6>;
        
        default:
            break;
        }
    }

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


    // Mobile Info
    const mobileInfo = useRef();
    const toggleMobileInfo = () => {
        if (mobileInfo.current.classList.contains("opened")) {
            mobileInfo.current.classList.remove("opened")
        }
        else {
            mobileInfo.current.classList.add("opened")
        }
    }


    // Scroll top when images changes.
    useEffect(() => {
        window.scrollTo(0,0);
    }, [chooseColor]);

  return (
    <>
        {
            product ?
            <div className="product">
                <div className="product__pictures">
                    {
                        chooseColor  ?
                        product.images[chooseColor].map(img => (
                        <div className="product__pictures--image" key={img}>
                            <img src={img} alt="item_image" />
                        </div>
                        ))
                        :
                        product.images[product.images.baseImagesColor].map(img => (
                        <div className="product__pictures--image" key={img}>
                            <img src={img} alt="item_image" />
                        </div>
                        ))
                    }
                </div>
                <div className="product__details" ref={productHeaderWrapper}>
                    <form onSubmit={handleSubmit} className="product__details--wrapper formS1" ref={productHeader}>
                        <div className="product__details--priceAndAction fRow">
                            <div className="product__details--price fColumn">
                                <span>$ { product.basePrice }</span>
                            </div>
                            {
                                renderSubmitButton(submitButtonStatus)
                            }
                        </div>

                        <div className="product__details--info">
                            <h1 className="product__details--name">{ product.title }</h1>
                            <p className="product__details--description">{ product.description }</p>
                            {
                                renderStatusLabel(statusLabelStatus)
                            }
                        </div>

                        <div className="product__details--features fRow">
                            <div className={`${chooseSizeError} product__details--size fColumn`}>
                                <h2 className='product__details--heading'>
                                    Choose Size
                                    <button type='button' className='buttonS1 buttonClear' onClick={showSizeGuide}>Size guide</button>
                                </h2>
                                <label className="fInput--select">
                                    <select name="selectSize" id="selectSize" value={chooseSize} onChange={handleChoose}>
                                        <option value="selectSizeDefault">Select Size</option>
                                    {
                                        Object.keys(product.sizes).map((size, i) => (
                                        product.sizes[size].status !== 0 ?
                                        <option value={size} key={i}>
                                        {
                                            size
                                            + " " + 
                                            renderSizeStatus(product.sizes[size].status)
                                        }
                                        </option>
                                        : /* Make "out of stock" options gray */
                                        <option style={{color: "gray"}} value={size} key={i}>
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
                            <div className={`${chooseColorError} product__details--color fColumn`}>
                                <h2 className='product__details--heading'>Choose Color</h2>
                                <label htmlFor="selectColor" className="fRadio">
                                    <div className="fRow fRadios--left">
                                    {
                                        chooseSize === "selectSizeDefault" || chooseSize === undefined ?
                                        allUniqueColors && allUniqueColors.map((color, i) => (
                                        <label htmlFor={color} key={i}>
                                            <input
                                                type="radio"
                                                name="selectColor"
                                                id={color}
                                                value={color}
                                                checked={chooseColor === color}
                                                onChange={handleChoose}
                                            />
                                            <span style={{background: color}} />
                                        </label>
                                        ))
                                        :
                                        !product.sizes[chooseSize].colors || product.sizes[chooseSize].colors.length === 0 ?
                                        <h4>Out of Stock</h4>
                                        :
                                        product.sizes[chooseSize].colors.map((color, i) => (
                                        <label htmlFor={color} key={i}>
                                        <input
                                            type="radio"
                                            name="selectColor"
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
                                </label>
                            </div>
                        </div>
                        
                        <div className="product__details--details">
                            <h2 className='product__details--heading'>PRODUCT DETAILS</h2>
                            <ul className='product__details--detailsList'>
                                {
                                    product.details.map((detail, i) => (
                                        <li key={i}>{detail}</li>
                                    ))
                                }
                                <span>Materials: { product.materials }</span>
                                <span>Product ID: { product.productId }</span>
                            </ul>
                        </div>


                        {/* Mobile Details */}
                        <div className="product__details--info--mobile">
                            <button type='button' onClick={toggleMobileInfo} className='buttonClear'>
                                <h1>{product.title}</h1>
                                <i className="fa-solid fa-chevron-down"></i>
                            </button>

                            <div className="product__details--info--mobile--details" ref={mobileInfo}>
                                <button type='button' onClick={toggleMobileInfo} className='buttonClear'>
                                    <h1>{product.title}</h1>
                                    <i className="fa-solid fa-chevron-up"></i>
                                </button>

                                {
                                    renderStatusLabel(statusLabelStatus)
                                }
                                <p className="product__details--mobile--description">{ product.description }</p>

                                <div className="product__details--mobile--details">
                                    <h2 className='product__details--mobile--heading'>PRODUCT DETAILS</h2>
                                    <ul className='product__details--mobile--detailsList'>
                                    {
                                        product.details.map((detail, i) => (
                                            <li key={i}>{detail}</li>
                                        ))
                                    }
                                        <span>Materials: { product.materials }</span>
                                        <span>Product ID: { product.productId }</span>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
            : // Product Not Found
            empty ?
            <PAGE_NOTFOUND />
            : // Loading
            <div className='loadingZone'>
                <span className='loadingS1'/>
            </div>
        }
    </>
  )
}

export default PAGE_PRODUCT