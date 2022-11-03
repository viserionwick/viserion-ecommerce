// Essentials
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// Hooks
import useTabTitle from "../../hooks/useTabTitle";

// Components: Categories
import PAGE_LEGAL_TERMSANDCONDITIONS from "./categories/Page_Legal_TermsAndConditions";
import PAGE_LEGAL_COOKIE from "./categories/Page_Legal_Cookie";
import PAGE_LEGAL_PRIVACY from "./categories/Page_Legal_Privacy";
import PAGE_LEGAL_RETURN from "./categories/Page_Legal_Return";


// Style
import "./Page_Legal.scss";

const PAGE_LEGAL = () => {

    useTabTitle("Legal");

    const [categories, setCategories] = useState("termsAndConditions");

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
      navigate("/legal?category="+value);
    }

    const handleSubmit = (e) => {
      e.preventDefault();
    }

  return (
    <div className="p-legal">
      <h1 className="p-legal--header">
        Legal
      </h1>

      <div className="p-legal--wrapper">
        <form onSubmit={handleSubmit} className="p-legal--categoriesSelect formS1">
          <div className="fRow">
            <div className="fColumn">
              <label htmlFor="categories" className="fInput--select">
                <select name="categories" id="categories" value={categories} onChange={handleInput}>
                  <option value="termsAndConditions">Terms & Conditions of Sale</option>
                  <option value="return">Return Policy</option>
                  <option value="cookie">Cookie Policy</option>
                  <option value="privacy">Privacy Policy</option>
                </select>
              </label>
            </div>
          </div>
        </form>
      
        <div className="p-legal--contentWrapper">
          {
            categories === "termsAndConditions" &&
            <PAGE_LEGAL_TERMSANDCONDITIONS />
          }
          {
            categories === "return" &&
            <PAGE_LEGAL_RETURN />
          }
          {
            categories === "cookie" &&
            <PAGE_LEGAL_COOKIE />
          }
          {
            categories === "privacy" &&
            <PAGE_LEGAL_PRIVACY />
          }
        </div>
      </div>



    </div>
  )
}

export default PAGE_LEGAL