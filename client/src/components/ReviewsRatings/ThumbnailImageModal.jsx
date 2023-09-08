/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import React from 'react';

function ThumbnailImageModal({ RNRCSS, toggleModalImage, photo }) {
  return (
    <div className={RNRCSS.modal}>
      <div className={RNRCSS.overlay}>
        <div className={RNRCSS['modal-content']}>
          <img
            className={RNRCSS['modal-image-full-size']}
            key={photo.id}
            src={photo.url}
            alt={`${photo.id}`}
            height={20}
            width="auto"
            onClick={() => { toggleModalImage(true); }}
            loading="lazy"
          />
          <input type="submit" className={RNRCSS['close-modal']} onClick={() => { toggleModalImage(false); }} value="X" />
        </div>
      </div>
    </div>
  );
}

export default ThumbnailImageModal;
