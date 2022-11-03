// Essentials
import { Link } from "react-router-dom";

// Hooks
import useTabTitle from '../hooks/useTabTitle';

// Style
import "./index.scss";

function Index() {

  useTabTitle("Official Online Boutique");

  // Images
  const background = {
    background: `url(https://firebasestorage.googleapis.com/v0/b/balenciaga-mockup.appspot.com/o/home%20page%2Fgif%2Fhomepage.gif?alt=media&token=f52713ac-7d77-4923-bdc7-8771965d69dc) no-repeat`,
    backgroundSize: "cover",
    backgroundPositionX: "center"    
  }
  

  return (
    <div className="page__home">
        <div className="page__home__row intro" style={background}>
          <Link to="/women"> Women </Link>
          <Link to="/men"> Men </Link>        
        </div>
    </div>
  )
}

export default Index