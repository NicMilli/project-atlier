import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  FaHeart, FaTwitter, FaPinterest, FaFacebookF, FaChevronRight,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import QuarterStarsAverageRating from '../ReviewsRatings/QuarterStarsAverageRating';
import StyleList from './StyleList';
import { handleStateUpdate } from '../../features/products/productsSlice';
import { useAddToCartMutation, api } from '../../features/api/apiSlice';
import { newAddToOutfit, newRemoveFromOutfit } from '../../features/related/relatedSlice';

function Details({ handleScroll }) {
  const [stock, setStock] = useState(true);
  const [refreshed, setRefreshed] = useState(false);
  const [update] = api.endpoints.getProductStyles.useLazyQuery();
  const {
    selectedStyle,
    sku,
    quantitySelected,
    details,
    dark,
  } = useSelector((state) => state.products);
  const { meta } = useSelector((state) => state.reviews);

  const dispatch = useDispatch();
  let { quantity } = sku !== '' ? selectedStyle.skus[sku] || 0 : 0;
  const [trigger] = useAddToCartMutation();
  const sizeRef = useRef(null);

  const checkStock = () => {
    const values = typeof selectedStyle.skus === 'object' ? Object.values(selectedStyle.skus) : [];

    if (values.length > 0) {
      const inStock = values.reduce((accum, val) => accum + val.quantity, 0);
      return !!inStock;
    }
    return false;
  };

  useEffect(() => {
    setStock(checkStock());
  }, [selectedStyle]);

  if (quantity > 15) {
    quantity = 15;
  }

  const handleCartClick = async () => {
    if (sku !== '' && sku !== 'selectSize') {
      const res = await trigger(sku);
      const result = await res.data;
      if (result === 'Content created') {
        toast.success(`${details.name}, ${selectedStyle.name}, size: ${selectedStyle.skus[sku].size}, quantity: ${quantitySelected} added to cart successfully`);
        dispatch(handleStateUpdate({ name: 'sku', value: 'selectSize' }));
        update(details.id);
        sizeRef.value = 'selectSize';
      } else {
        toast.error('Unable to add to cart');
      }
    } else if (!stock) {
      toast.error('Sorry, this item is out of stock. Please check back later. We apologize for the inconvenience!');
    } else {
      sizeRef.current.focus();
      sizeRef.current.size = 6;
      toast.error('Unable to add to cart: please select a size');
    }
  };

  const handleAddOutfitClick = () => {
    dispatch(newAddToOutfit({ details, selectedStyle, meta }));
    setRefreshed(!refreshed);
  };
  const handleRemoveOutfitClick = () => {
    dispatch(newRemoveFromOutfit({ details, selectedStyle, meta }));
    setRefreshed(!refreshed);
  };

  const handleRnrClick = () => {
    handleScroll('rnr');
  };

  const handleSizeClick = (e) => {
    if (e.target.size > 0) {
      sizeRef.current.size = 0;
    }
    dispatch(handleStateUpdate({ name: e.target.name, value: e.target.value }));
  };

  return (
    <div className="detailsBar">
      <div className="flex rating-link">
        <QuarterStarsAverageRating productRating={meta.ratings} />
        <button type="button" className={dark ? 'buttonWrap reviews-btn-dark' : 'buttonWrap reviews-btn'} onClick={handleRnrClick}>See all reviews</button>
      </div>
      <div>
        <p className="category">
          {`${details.category}:`}
        </p>
        <p className={dark ? 'product-name-dark' : 'product-name'}>
          {details.name}
        </p>
      </div>
      <div>
        <div className="flex">
          { selectedStyle.sale_price ? (
            <p className="sale price">

              {`$${selectedStyle.sale_price}`}
            &nbsp;&nbsp;
            </p>
          ) : null}
          <p className={selectedStyle.sale_price ? 'originalPrice price' : 'price'}>
            {`$${selectedStyle.original_price}`}
          </p>
        </div>

        <div style={{ display: 'flex' }}>
          <p className={dark ? 'style-name-dark' : 'style-name'} style={{ fontWeight: '600' }}>
            STYLE
            {' '}
            <FaChevronRight size={15} />
            {' '}
          </p>
          <p className={dark ? 'style-name-dark' : 'style-name'}>
            {selectedStyle.name}
          </p>
        </div>

        <br />
        <StyleList />
      </div>

      <div className="dropdowns">
        <div className="flex">
          <select className="size-selector" aria-label="size-select" name="sku" onChange={handleSizeClick} disabled={!stock} id="sizeBtn" ref={sizeRef} value={sku}>
            <option value={stock ? 'selectSize' : 'outOfStock'}>{stock ? 'Select Size' : 'Out Of Stock'}</option>
            {typeof selectedStyle.skus === 'object' && Object.keys(selectedStyle.skus).map(
              (sizeSku) => (
                <option
                  key={sizeSku}
                  value={sizeSku}
                  disabled={!selectedStyle.skus[sizeSku].quantity}
                >
                  {selectedStyle.skus[sizeSku].size}
                </option>
              ),
            )}
          </select>
          <select className="qty-selector" aria-label="qty-select" name="quantitySelected" onChange={(e) => { dispatch(handleStateUpdate({ name: e.target.name, value: e.target.value })); }}>
            {quantity
              ? Array.from({ length: quantity }, (_, i) => i + 1).map(
                (qty) => (<option key={qty} value={qty}>{qty}</option>),
              )
              : <option>-</option>}
          </select>
        </div>
        <br />
        <div className="flex">
          <button className="cart-btn button-dark" type="button" aria-label="cart-btn" onClick={handleCartClick}>
            Add to cart
          </button>
          <button className="outfit-btn button-light" aria-label="Add to outfit" type="button" onClick={JSON.parse(localStorage.getItem(details.id)) ? handleRemoveOutfitClick : handleAddOutfitClick}>
            <FaHeart style={{ fill: JSON.parse(localStorage.getItem(details.id)) ? 'red' : 'black' }} />
          </button>
        </div>
      </div>
      <div className="socials">
        <a className="social-icon center" href={`https://twitter.com/intent/tweet?url=${process.env.APP_URL}/${details.id}`} target="_blank" rel="noreferrer" aria-label="Share to Twitter"><FaTwitter className="twitter" /></a>
        <a className="social-icon center" href={`https://www.facebook.com/sharer.php?u=${process.env.APP_URL}/${details.id}`} target="_blank" rel="noreferrer" aria-label="Share to Facebook"><FaFacebookF className="facebook" /></a>
        <a className="social-icon center" href={`http://pinterest.com/pin/create/link/?url=${process.env.APP_URL}/${details.id}`} target="_blank" rel="noreferrer" aria-label="Share to Pinterest"><FaPinterest className="pinterest" /></a>
      </div>
    </div>
  );
}

export default Details;
