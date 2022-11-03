// Essentials
import { Link } from "react-router-dom"

// Hooks
import useTabTitle from "../../hooks/useTabTitle";

// Style
import "./Page_NotFound.scss"

const PAGE_NOTFOUND = () => {

    useTabTitle("Page Not Found");

  return (
    <div className="p-notFound">
        <div className="p-notFound--content">
            <h1>
                SORRY, <br/> WE COULDN'T FIND THE PAGE YOU ARE LOOKING FOR.
            </h1>
            <p>
                The page may have been removed, changed or it is temporarily unavailable.    
            </p>
            <p>
                Feel free to contact client service by <Link to="/contact">E-Mail</Link> or phone at <a href="tel:+16468891895" rel="noreferrer">+1 646 889 1895</a>, we will be glad to help you.
            </p>
            
            <Link to="/" className="buttonS1">Go To Home Page</Link>
        </div>
    </div>
  )
}

export default PAGE_NOTFOUND