// Essentials
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// Hooks
import useTabTitle from "../../hooks/useTabTitle";

// Components: Categories
import PAGE_FAQ_SHIPPING from "./categories/Page_Faq_Shipping";
import PAGE_FAQ_PAYMENT from "./categories/Page_Faq_Payment";


// Style
import "./Page_Faq.scss";

const PAGE_LEGAL = () => {

    useTabTitle("FAQ");

    const [categories, setCategories] = useState("shipping");

    // Url Handle
    let navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
      let query = searchParams.get("category");

      query && setCategories(query);
    }, []);

    const handleInput = (e) => {
      const { value } = e.target;
      setCategories(value);
      navigate("/faq?category=" + value);
    }

    const handleSubmit = (e) => {
      e.preventDefault();
    }

  return (
    <div className="p-legal">
      <h1 className="p-legal--header">
        Frequently Asked Questions
      </h1>

      <div className="p-legal--wrapper">
        <form onSubmit={handleSubmit} className="p-legal--categoriesSelect formS1">
          <div className="fRow">
            <div className="fColumn">
              <label htmlFor="categories" className="fInput--select">
                <select name="categories" id="categories" value={categories} onChange={handleInput}>
                  <option value="shipping">Shipping</option>
                  <option value="payment">Payment</option>
                </select>
              </label>
            </div>
          </div>
        </form>
      
        <div className="p-legal--contentWrapper">
          {
            categories === "shipping" &&
            <PAGE_FAQ_SHIPPING />
          }
          {
            categories === "payment" &&
            <PAGE_FAQ_PAYMENT />
          }
        </div>
      </div>



    </div>
  )
}

export default PAGE_LEGAL