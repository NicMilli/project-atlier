import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ImageViewer from './ImageViewer';
import Details from './Details';
import Description from './Description';
import Spinner from '../SharedComponents/Spinner';
import './products.css';
import { useGetSpecificProductQuery, useGetProductStylesQuery } from '../../features/api/apiSlice';

function ProductDetails({ handleScroll }) {
  const params = useParams();
  const navigate = useNavigate();
  const { expanded, zoom } = useSelector((state) => state.products);

  const {
    data: productInfo,
    isFetching,
    isError,
  } = useGetSpecificProductQuery(`${params.productId}`, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: styles,
    isLoading,
    error,
  } = useGetProductStylesQuery(`${params.productId}`, {
    refetchOnMountOrArgChange: true,
  });

  // console.log(productInfo.styles.results);

  useEffect(() => {
    if (error || isError) {
      navigate('/NotFound');
    }
  }, [productInfo, isFetching, error, isError]);

  if (!styles || isFetching || isLoading || !productInfo) {
    return <Spinner />;
  }

  if (!styles.results && Object.keys(productInfo).length === 0) { navigate('/NotFound'); }

  return (
    <div>
      {expanded || zoom ? (
        <div className="mainDiv">
          <ImageViewer />
        </div>
      ) : (
        <div className="mainDiv">
          <div>
            <ImageViewer />
          </div>
          <div className="detailsDiv">
            <Details handleScroll={handleScroll} />
          </div>
        </div>
      )}
      <Description />
    </div>
  );
}

export default ProductDetails;
