import React, { useState } from 'react';
import RNRCSS from './Modal.module.css';
import ImageDropzone from './ImageDropzone';

function AddImageReviews({uploadImageHandler}) {
  const [modal, setModal] = useState(false);
  const [images, setImages] = useState([]);
  const [inputField, setInputField] = useState('');
  const handleUploadedImages = () => {
    if (inputField.length > 1) {
      setImages((prevState) => [...prevState, inputField]);
      setInputField('');
    }
  };
  const handleInputFieldChange = (e) => {
    setInputField(e.target.value);
  };
  const toggleModal = (inputBool) => {
    setModal(inputBool);
  };
  return (
    <>
      <input
        type="submit"
        onClick={(event) => {
          event.preventDefault();
          uploadImageHandler(images);
          toggleModal(true);
        }}
        value="Add images"
      />
      {modal
      && (
        <div className={RNRCSS['modal']}>
          <div className={RNRCSS['overlay']}>
            <div className={RNRCSS['modal-content']}>
              <h2> Add images to your review!</h2>
              <input
                placeholder="insert image link here"
                value={inputField}
                onChange={handleInputFieldChange}
              />
              <ImageDropzone handleUploadedImages={handleUploadedImages} />
              {images.length < 5
                && (
                <input
                  type="submit"
                  className={RNRCSS['add-image-input']}
                  onClick={(event) => {
                    event.preventDefault();
                    handleUploadedImages(inputField);
                  }}
                  value="upload image"
                />
                )}
              {images.length > 0
              && (
                <div>
                  {images.map((image, index) => (
                    <img
                      className={RNRCSS['thumbnail-uploaded-review-image']}
                      src={image}
                      alt={`${image}`}
                      key={index.toString()}
                    />
                  ))}
                </div>
              )}
              <input
                type="submit"
                className={RNRCSS['close-modal']}
                onClick={() => { toggleModal(false); }}
                value="X"
              />
              <input
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  uploadImageHandler(images);
                  toggleModal(false);
                }}
                value="submit all images"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddImageReviews;
