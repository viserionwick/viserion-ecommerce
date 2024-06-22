// Essentials
import React from 'react';
import { Route, Routes } from 'react-router-dom';


//---------- Components ---------- START
import LAYOUT from './layout/Layout';

// PAGES: Essentials
import Index from './pages';
import PAGE_DASHBOARD from './dashboard/Page_Dashboard';
import PAGE_NOTFOUND from './pages/404/Page_NotFound';
import PAGE_SEARCH from './pages/search/Page_Search';
import PAGE_SHOPPINGBAG from './pages/bag/Page_ShoppingBag';
import PAGE_CHECKOUT from './pages/checkout/Page_Checkout';

// PAGES: Other
import PAGE_CONTACT from './pages/contact/Page_Contact';
import PAGE_LEGAL from './pages/legal/Page_Legal';
import PAGE_FAQ from './pages/faq/Page_Faq';

// PAGES: Auth
import PAGE_LOGIN from './pages/auth/Page_Login';
import PAGE_REGISTER from './pages/auth/Page_Register';
import PAGE_ACCOUNT from './pages/auth/account/Page_Account';

// PAGES: Products
import PRODUCTS_EXPLORE from "./pages/products/categories/Products_Explore";
import PRODUCTS_MEN from "./pages/products/categories/Products_Men";
import PRODUCTS_WOMEN from "./pages/products/categories/Products_Women";
import PAGE_PRODUCT from './pages/products/Page_Product';

//---------- Components ---------- END


// Hooks
import useCookieConsent from './hooks/useCookieConsent/useCookieConsent';

// Styles
import "./App.scss"

const App = () => {

  const { CookieConsentAsk } = useCookieConsent();

  return (
    <>

    <CookieConsentAsk />

    <Routes>

      {/* Essential Pages */}
      <Route path='*' element={
        <LAYOUT content={<PAGE_NOTFOUND />} />
      } />

      <Route exact path='/' element={
        <LAYOUT content={<Index />} />
      } />

      <Route path='/dashboard' element={
        <PAGE_DASHBOARD />
      } />

      <Route path='/dashboard/:id' element={
        <PAGE_DASHBOARD />
      } />

      <Route path='/search' element={
        <LAYOUT content={<PAGE_SEARCH />} />
      } />

      <Route path='/bag' element={
        <LAYOUT content={<PAGE_SHOPPINGBAG />} />
      } />

      <Route path='/checkout' element={
        <LAYOUT content={<PAGE_CHECKOUT />} />
      } />


      {/* Other Pages */}
      <Route path='/contact' element={
        <LAYOUT content={<PAGE_CONTACT />} />
      } />

      <Route path='/legal' element={
        <LAYOUT content={<PAGE_LEGAL />} />
      } />

      <Route path='/faq' element={
        <LAYOUT content={<PAGE_FAQ />} />
      } />



      {/* Auth Pages */}
      <Route path='/register' element={
        <LAYOUT content={<PAGE_REGISTER />} />
      } />

      <Route path='/login' element={
        <LAYOUT content={<PAGE_LOGIN />} />
      } />

      <Route path='/account' element={
        <LAYOUT content={<PAGE_ACCOUNT />} />
      } />


      {/*------------- Product Pages -------------*/}
      <Route path='/explore' element={
        <LAYOUT content={<PRODUCTS_EXPLORE />} />
      } />

      <Route path='/explore/:id' element={
        <LAYOUT content={<PRODUCTS_EXPLORE />} />
      } />

      <Route path='/men' element={
        <LAYOUT content={<PRODUCTS_MEN />} />
      } />

      <Route path='/men/:id' element={
        <LAYOUT content={<PRODUCTS_MEN />} />
      } />

      <Route path='/women' element={
        <LAYOUT content={<PRODUCTS_WOMEN />} />
      } />

      <Route path='/women/:id' element={
        <LAYOUT content={<PRODUCTS_WOMEN />} />
      } />

      <Route path='/product/:id' element={
        <LAYOUT content={<PAGE_PRODUCT />} />
      } />
      
      </Routes>
    </>
  )
}

export default App