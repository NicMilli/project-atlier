import React from 'react';
import { nanoid } from '@reduxjs/toolkit';
import StyleImage from './StyleImage';
import { useSelector } from 'react-redux';

function StyleList() {
  const { styles } = useSelector((state) => state.products);

  return (
    <div className="flex containCircles">
      {styles.map((style) => {
        if (!style.photos || !style.photos[0].thumbnail_url) {
           return (
            <StyleImage
              image='https://images.unsplash.com/photo-1584824486509-112e4181ff6b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bm90JTIwZm91bmR8ZW58MHx8MHx8&auto=format&fit=crop&w=400&q=60'
              key={nanoid()}
              style={style}
            />
      )
        }
        return (
        <StyleImage
          image={style.photos[0].thumbnail_url}
          key={nanoid()}
          style={style}
        />
      )})}
    </div>
  );
}

export default StyleList;
