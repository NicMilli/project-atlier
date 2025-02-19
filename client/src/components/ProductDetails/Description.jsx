import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { useSelector } from 'react-redux';

function Description() {
  const { details } = useSelector((state) => state.products);

  if (!details) {
    return null;
  }

  return (
    <div className="description flex">
      <div className="description-card center">
        <h3>{details.slogan}</h3>
        {details.description}
      </div>
      <div className="features-card">
        <ol>
          {details?.features?.map((item) => {
            const { feature, value } = item;
            return value ? (
              <li className="feature-item left" key={`${feature}${value}`}>

                <FaCheck />
                  &nbsp;
                {`  ${feature}  :  ${value}`}

              </li>
            ) : null;
          })}
        </ol>
      </div>
    </div>
  );
}

export default Description;
