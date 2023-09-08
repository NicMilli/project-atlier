import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { newOutfitList, newAddToOutfit } from '../../features/related/relatedSlice';
import { FaPlusCircle } from 'react-icons/fa';
import QuarterStarsAverageRating from '../ReviewsRatings/QuarterStarsAverageRating';
import FormatCard from './FormatCard';
import itemStyles from './Items.module.css';

function OutfitList({ outfitIndex }) {
  const dispatch = useDispatch();

  // Generate outfitlist upon page load
  useEffect(() => {
    dispatch(newOutfitList());
  }, []);

  // Compiles current object data
  const { outfitList } = useSelector((state) => state.related);
  const { selectedStyle, details } = useSelector((state) => state.products);
  const { meta } = useSelector((state) => state.reviews);
  const currentProduct = { details, selectedStyle, meta };

  // Add item to outfit card
  function handleAddToOutfit(productData) {
    dispatch(newAddToOutfit(productData));
  }

  // Searches item data for first photo
  function findImage(item) {
    for (let i = 0; i < item.selectedStyle.photos.length; i++) {
      const stylePhoto = item.selectedStyle.photos[i];
      if (stylePhoto.thumbnail_url) {
        return stylePhoto.thumbnail_url;
      }
    }
  }

  // Produces a card for each item in the outfit
  function renderList(item, index) {
    console.log(item.meta)
    return (
      <div key={index}>
        {outfitIndex <= index && (
          <FormatCard
            stars={Object.keys(item.meta.ratings).length > 0
              ? <QuarterStarsAverageRating productRating={item.meta.ratings} />
              : <p>rating unavailable</p>}
            name={item.details.name}
            category={item.details.category}
            image={findImage(item)}
            price={item.details.default_price}
            salePrice={item.selectedStyle.sale_price}
            itemStyles={itemStyles}
            outfit="outfit"
            item={item}
          />
        )}
      </div>
    );
  }

  return outfitList && (
    <div className={itemStyles['items-list-wrapper']}>
      <span className={itemStyles['items-list-title']}>Your outfit</span>
      <div className={itemStyles['items-list-content']}>
        <div className={`${itemStyles['items-card']} ${itemStyles['items-card-plus']}`}
          onClick={() => dispatch(newAddToOutfit(currentProduct))}>
          <FaPlusCircle className={itemStyles['items-plus']} />
          <div className={itemStyles['items-add-to-outfit']}>Add to outfit</div>
        </div>
        {outfitList.map((item, index) => renderList(item, index))}
      </div>
    </div>
  );
}

export default OutfitList;
