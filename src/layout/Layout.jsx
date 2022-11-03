// Essentials

// Components
import CONTENT from "./Content";
import FOOTER from "./Footer";
import HEADER from "./Header";

// Style
import "./Layout.scss";

const LAYOUT = ({content}) => {
  return (
    <>
        <HEADER />
        <CONTENT content={content} />
        <FOOTER />
    </>
  )
}

export default LAYOUT