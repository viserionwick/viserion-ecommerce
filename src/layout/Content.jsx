// Essentials
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom'


// Styles
import "./Layout.scss";


const CONTENT = ({content}) => {

  // Scroll to top on page change
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="l-content">
      {content}
    </div>
  )
}

export default CONTENT