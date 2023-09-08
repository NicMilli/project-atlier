import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaInfoCircle, FaTimesCircle } from 'react-icons/fa';
import itemStyles from './Items.module.css';
import {
  newModalState,
  newRelatedProductName,
  newRelatedProductFeatures,
  generateProductFeatures,
  newCurrentProductName,
  newRemoveFromOutfit,
  newOutfitList,
} from '../../features/related/relatedSlice';

function FormatCard({
  name, image, price, category, stars, outfit, item, salePrice,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { details } = useSelector((state) => state.products);
  const errorImg = 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bm90JTIwZm91bmR8ZW58MHx8MHx8&auto=format&fit=crop&w=400&q=60';

  // itemData is passed as a prop 'item' from the corresponding list
  function removeFromOutfit(itemData) {
    dispatch(newRemoveFromOutfit(itemData));
    dispatch(newOutfitList());
  }

  // Generates data for modal based on card selected
  function handleModalClick(e, itemData) {
    e.preventDefault();
    dispatch(newModalState());
    dispatch(newRelatedProductFeatures(itemData.details.features));
    dispatch(newRelatedProductName(itemData.details.name));
    dispatch(newCurrentProductName(details.name));
    dispatch(generateProductFeatures(details.features));
  }

  // Refreshes page to selected related item
  function navigateToRelatedItem(e, productId) {
    e.preventDefault();
    navigate(`/${productId}`);
  }

  return (
    <div className={itemStyles['items-card']} onDoubleClick={(e) => navigateToRelatedItem(e, item.details.id)}>
      <FaInfoCircle
        className={
        `fa-solid fa-circle-info ${itemStyles['items-icon']} ${itemStyles['items-modal']}`
}
        onClick={(e) => handleModalClick(e, item)}
      />
      {outfit && (
      <FaTimesCircle
        className={
        `fa-solid fa-circle-xmark ${itemStyles['items-icon']} ${itemStyles['items-xmark']}`
}
        onClick={() => removeFromOutfit(item)}
        aria-label="remove-icon"
      />
      )}
      <img className={itemStyles['items-card-img']} src={image || errorImg} alt="" loading="lazy" />
      <div className={itemStyles['items-details']}>
        <div className={itemStyles['items-stars']}>{stars}</div>
        <p className={itemStyles['items-product-category']}>{category}</p>
        <h6 className={itemStyles['items-product-name']}>{name}</h6>
        {salePrice ? (
          <div className={itemStyles['items-price']}>
            <p className={itemStyles['items-price-sale']}>{`$${salePrice}`}</p>
            <p><s>{`$${price}`}</s></p>
          </div>
        ) : <p>{`$${price}`}</p>}
      </div>
    </div>
  );
}

export default FormatCard;
