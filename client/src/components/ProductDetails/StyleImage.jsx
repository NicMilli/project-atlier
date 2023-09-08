import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaRegCheckCircle } from 'react-icons/fa';
import { newSelectedStyle, newSelectedImage, handleStateUpdate } from '../../features/products/productsSlice';

function StyleImage({ image, style }) {
  const { selectedStyle, imageIndex, page } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const [current, setCurrent] = useState(style.style_id === selectedStyle.style_id);

  const handleClick = () => {
    const len = style.photos?.length || 0;
    dispatch(newSelectedStyle(style));
    if (imageIndex < len) {
      dispatch(newSelectedImage(style.photos[imageIndex].url));
    } else {
      dispatch(newSelectedImage(style.photos[len - 1].url));
      dispatch(handleStateUpdate({ name: 'imageIndex', value: len - 1 }));
    }
    if ((page > Math.floor(len / 7))) {
      dispatch(handleStateUpdate({ name: 'page', value: Math.floor(len / 7) }));
    }
  };


  const defaultImg = (e) =>{
    e.target.src = 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bm90JTIwZm91bmR8ZW58MHx8MHx8&auto=format&fit=crop&w=400&q=60'
  }

  return (
    <div className="flex circleDiv">
      <button className="buttonWrap circle-btn" onClick={handleClick} type="button" aria-label="style-image">
        {current ? <FaRegCheckCircle className="visible fa-check" size="20px" color="black" /> : null}
        <img className={current ? 'selected' : 'circleImage'} src={image || 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bm90JTIwZm91bmR8ZW58MHx8MHx8&auto=format&fit=crop&w=400&q=60'} alt="ImageView" height="60" width="auto" onError={defaultImg} />
      </button>
    </div>
  );
}

export default StyleImage;
