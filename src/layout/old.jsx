<>
      {/* Header */}
      <div className="l-header" ref={header}>
        <div className="l-header__row" id="l-header__top">

          <form
            onSubmit={searchBoxSubmit}
            className='searchBoxForm deleteMe formS1'
            ref={searchBoxForm_ref}
          >
            <button type='submit' className='searchSubmitButton'><i className="fa-solid fa-magnifying-glass"></i></button>
            <input
              ref={searchBoxInput_ref}
              type="text"
              name='search'
              id='searchBox'
              className='fInput'
              value={searchBox}
              onChange={searchBoxHandle}
              autoComplete="off"
              spellCheck="false"
            />
            <button type='button' onClick={() => toggleSearchBox("")} className='searchCloseButton'><i className="fa-solid fa-xmark"></i></button>
          </form>

          {/* Left: Desktop */}
          <nav className="l-header__column" id="l-header__top__miniNav">
            <button onClick={() => toggleSearchBox("")} className='l-header__top--bigButtons' id='l-header__top__searchButton'>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            <NavLink to="/women">women</NavLink>
            <NavLink to="/men">men</NavLink>
            <NavLink to="/explore">explore</NavLink>
          </nav>
          {/* Left: Mobile */}
          <nav className="l-header__column mobile" id="l-header__top__miniNav">
            <button className='l-header__top--bigButtons' id='l-header__top__searchButton' onClick={() => toggleMenu("")}>
              <i className="fa-solid fa-bars"></i>
            </button>
          </nav>

          {/* Middle: Desktop */}
          <div className="l-header__column" id="l-header__top__logo">
            <Link to="/" onClick={() => toggleSearchBox("close")}>
              <img src={Logo} alt="logo" />
            </Link>
          </div>
          {/* Middle: Mobile */}
          <div className="l-header__column mobile" id="l-header__top__logo">
            <Link to="/">
              <img src={Logo} alt="logo" />
            </Link>
          </div>
          
          {/* Right: Desktop */}
          <div className="l-header__column" id="l-header__top__profile">
            <button onClick={() => {changeCountry(); toggleSearchBox("close")}}>united states</button>
            <NavLink to="/faq" onClick={() => toggleSearchBox("close")}>client service</NavLink>
            {
              !isAuthLoading ?
                !isAuth ?
                <NavLink to="/login" onClick={() => toggleSearchBox("close")}>Log In</NavLink>
                :
                <NavLink to="/account" onClick={() => toggleSearchBox("close")}>My Account</NavLink>
              :
              <></>
            }
            <button className='l-header__top--bigButtons' id='l-header__top__shoppingBagButton' onClick={() => {toggleSearchBox("close"); toggleBag("");}}>
              <i className="fa-solid fa-bag-shopping" />
            { 
              shoppingBagList.length !== 0 &&
              <span id='shoppingBagItemCount'>{ shoppingBagList.length }</span>
            }
            </button>
          </div>
          {/* Right: Mobile */}
          <div className="l-header__column mobile" id="l-header__top__profile">
            <button onClick={() => toggleSearchBox("")} className='l-header__top--bigButtons' id='l-header__top__searchButton'>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            <button className='l-header__top--bigButtons' id='l-header__top__shoppingBagButton' onClick={() => toggleBag("")}>
              <i className="fa-solid fa-bag-shopping" />
            { 
              shoppingBagList.length !== 0 &&
              <span id='shoppingBagItemCount'>{ shoppingBagList.length }</span>
            }
            </button>
          </div>

        </div>
      </div>


    {/* Mobile Menu */}
      <div className={isMenuOpen ? "l-header__mobileMenu" : "l-header__mobileMenu deleteMe"} ref={mobileMenu}>
        <div className="l-header__mobileMenu--header">
          <button onClick={() => toggleMenu("")} className="buttonClear"><i className="fa-solid fa-xmark"></i></button>
          <span>Menu</span>
        </div>
        <div className="l-header__mobileMenu__content">
          {
            !mmLoading ?
            <>
            <ul className='l-header__mobileMenu__content--miniNav'>
              <li><NavLink end to="/" onClick={() => toggleMenu("")}>New Arrivals</NavLink></li>
              <li className='l-header__mobileMenu__content--miniNav--dropdown'>
                <span>
                  <NavLink to="/women" onClick={() => toggleMenu("close")}>Women</NavLink>
                  <button onClick={dropDownHandler}><i className="fa-solid fa-chevron-down"></i></button>
                </span>
                <ul>
                {
                    mmData.filter(gender => gender.id == "women")[0].subCategories.map((sub, i) => (
                      <li key={i}><NavLink end={i === 0} to={sub.url} onClick={() => toggleMenu("close")}>{sub.title}</NavLink></li>
                    ))
                  }
                </ul>
              </li>
              <li className='l-header__mobileMenu__content--miniNav--dropdown'>
                <span>
                  <NavLink to="/men" onClick={() => toggleMenu("close")}>Men</NavLink> 
                  <button onClick={dropDownHandler}><i className="fa-solid fa-chevron-down"></i></button>
                </span>
                <ul>
                  {
                    mmData.filter(gender => gender.id == "men")[0].subCategories.map((sub, i) => (
                      <li key={i}><NavLink end={i === 0} to={sub.url} onClick={() => toggleMenu("close")}>{sub.title}</NavLink></li>
                    ))
                  }
                </ul>
              </li>
              <li><NavLink to="/explore" onClick={() => toggleMenu("close")}>Explore</NavLink></li>
            </ul>
            <ul className='l-header__mobileMenu__content--profile'>
              <li>
              {
                !isAuthLoading ?
                  !isAuth ?
                  <NavLink to="/login" onClick={() => toggleMenu("close")}>Log In</NavLink>
                  :
                  <NavLink to="/account" onClick={() => toggleMenu("close")}>My Account</NavLink>
                :
                <></>
              }
              </li>
              <li><button onClick={() => {changeCountry(); toggleMenu("close");}}>united states</button></li>
              <li><NavLink to="/faq" onClick={() => toggleMenu("close")}>client service</NavLink></li>
            </ul>
            </>
            :
            <div className='loadingZone'>
              <span className='loadingS1'/>
            </div>
          }
        </div>

      </div>


    {/* Shopping Bag */}
      <div className={isBagOpen ? "l-header__shoppingBag" : "l-header__shoppingBag deleteMe"} ref={shoppingBag}>
        <div className="l-header__shoppingBag--header">
          <span>Shopping Bag</span>
          <button onClick={() => toggleBag("")} className="buttonClear"><i className="fa-solid fa-xmark"></i></button>
          
        </div>
        <div className="l-header__shoppingBag__list">
          { shoppingBagList.length === 0 ? 
            <div className='l-header__shoppingBag__list--empty'>
              <h1>Your shopping bag is empty</h1> 
              <Link to="/" className='buttonS1' onClick={() => { toggleBag("close"); }}>Continue Shopping</Link>
            </div>
            :
            shoppingBagList.map((item, itemIndex) => (
              <div className="l-header__shoppingBag__list--item" key={itemIndex}>
                <Link to={`/product/${item.url}`} className="l-header__shoppingBag__list--item__picture buttonClear" onClick={() => { toggleBag("close"); }}>
                  <img src={item.image} alt="item_image" />
                </Link>
                <div className="l-header__shoppingBag__list--item--details">

                  {/* Title & Price */}
                  <div className="l-header__shoppingBag__list--item--details--titleAndPrice">
                    <Link to={`/product/${item.url}`} className='l-header__shoppingBag__list--item--details__title buttonClear' onClick={() => { toggleBag("close"); }}>
                      {item.title}
                    </Link>
                    <div className="l-header__shoppingBag__list--item--details__totalPrice">
                      {"$ " + item.basePrice * item.quantity}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="l-header__shoppingBag__list--item--details--features">
                    <div className="l-header__shoppingBag__list--item--details--features__color">
                      <div>Color:</div>
                      <div>
                        <span style={{background: item.color}} />
                      </div>
                    </div>
                    <div className="l-header__shoppingBag__list--item--details--features__size">
                      <div>Size:</div>
                      <div>
                        <span>{item.size}</span>
                      </div>
                    </div>
                    <div className="l-header__shoppingBag__list--item--details--features__quantity">
                      <div>Quantity:</div>
                      <div>
                        <div className="l-header__shoppingBag__list--item--details--features__quantity--control">
                          <button onClick={() => handleQuantity("decrease", itemIndex)} className='buttonS3--clear'><i className="fa-solid fa-minus"></i></button>
                            <span>{item.quantity}</span>
                          <button onClick={() => handleQuantity("increase", itemIndex)} className='buttonS3--clear'><i className="fa-solid fa-plus"></i></button>
                        </div>
                        {
                          item.quantity >= item.maxQuantity ?
                            <div>
                              <p className='l-header__shoppingBag__list--item--details__row--amount--error'>Limit reached.</p>
                            </div>
                            :
                            null
                        }
                      </div>
                    </div>
                  </div>

                  {/* Buttons & Pre-Order Info */}
                  <div className="l-header__shoppingBag__list--item--details--buttonsAndInfo">
                    <div className="l-header__shoppingBag__list--item--details__preOrderDate">
                    {
                      item.status === 2 ?
                      <>
                      PRE-ORDER (Available on: {item.preOrderDate})
                      </>
                      :
                      null
                    }
                    </div>
                    
                    <div className="l-header__shoppingBag__list--item--details__buttons">
                      <button className='l-header__shoppingBag__list--item--details__removeButton buttonS1' onClick={() => handleRemove(item.productId)}>REMOVE</button>
                    </div>
                  </div>
                  
                </div>
              
              </div>
            ))
          }
        </div>
        <div className="l-header__shoppingBag__afterMath">
          { shoppingBagList.length === 0 ?
            <></>
            :
            <>
            <Link to="/" onClick={() => toggleBag("close")} className='buttonS2' id='l-header__shoppingBag__afterMath__checkoutButton'>Proceed to Checkout</Link>
            <Link to="/bag" onClick={() => toggleBag("close")} className='buttonS1' id='l-header__shoppingBag__afterMath__viewButton'>View Shopping Bag</Link>
            </>
          }
        </div>

      </div>

      
      {isBagOpen || isMenuOpen ? 
      <span id="l-header__panelBackground" onClick={() => {toggleBag("close"); toggleMenu("close")}} />
      :
      <></>
      }

      {
        isSearchBoxOpen && 
        <span id="l-header__panelBackground--forSearch" onClick={() => toggleSearchBox("close")} />
      }

    </>