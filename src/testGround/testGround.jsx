// Essentials
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { shoppingBagList_atom } from '../pages/bag/Page_ShoppingBag';

// Components
import LISTITEMS from '../components/products/ListItems';

// Style
import "./testGround.scss"


const TESTGROUND = () => {

  const [bagList, setBagList] = useAtom(shoppingBagList_atom);

  return (
    <div className='testGround'>
      {
        bagList &&
        <LISTITEMS list={bagList}/>
      }
    </div>
  )
}

export default TESTGROUND