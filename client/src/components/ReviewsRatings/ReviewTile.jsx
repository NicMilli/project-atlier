// this is the Review Tile component
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import QuarterIncStarRating from './QuarterIncStarRating';
import Report from './Report';

function ReviewTile({ index }) {
  const [helpful, setHelpful] = useState('');
  // send a post request with the helpful state to the API
  const { reviews } = useSelector((state) => state.reviews);
  return (
    <div>
      {reviews.results[index].rating}
      <QuarterIncStarRating averageRating={reviews.results[index].rating} />
      <h5>
        Review Title {reviews.results[index].summary}
      </h5>
      <small> Date posted:{ formatDistanceToNow(new Date(reviews.results[index].date))}
      </small>
      <p>{reviews.results[index].body}</p>
      {reviews.results[index].photos.map((photo) => (
        // eslint-disable-next-line jsx-a11y/img-redundant-alt
        <img key={photo.id} src={photo.url} alt={`Photo ${photo.id}`} />
      ))}
      <div>
        Helpful?
        <span onClick={() => { setHelpful('yes'); }}> Yes {reviews.results[index].helpfulness}</span>
        |
        <span onClick={() => { setHelpful('No'); }}>No</span>
        |
        <Report />
      </div>
      <div>_________________________________________________________________________________</div>
    </div>
  );
}

//<Search Bar Component>
//<average ratings component/>
//<Reviews component>

export default ReviewTile;
