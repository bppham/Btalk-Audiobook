import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStarHalfAlt,
  faStar as faSolidStar,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import "./Rating.css";
const Rating = ({ value = 0, onChange }) => {
  const [hover, setHover] = useState(null);

  const handleClick = (index, isHalf) => {
    const newValue = index + (isHalf ? 0.5 : 1);
    console.log("handleClick", { index, isHalf, newValue }); // 👈 log thêm
    onChange(newValue);
  };

  const handleMouseMove = (index, event) => {
    const { clientX, target } = event;
    const { left, width } = target.getBoundingClientRect();
    const isHalf = clientX - left < width / 2;
    setHover(isHalf ? index + 0.5 : index + 1);
  };

  const handleMouseLeave = () => {
    setHover(null);
  };

  return (
    <div className="rating-component">
      {[...Array(5)].map((_, index) => {
        const isFilled = hover !== null ? hover : value;
        const isHalf = isFilled - index === 0.5;
        return (
          <div
            key={index}
            className="star-wrapper"
            onClick={(event) =>
              handleClick(index, event.nativeEvent.offsetX < 12)
            }
            onMouseMove={(event) => handleMouseMove(index, event)}
            onMouseLeave={handleMouseLeave}
          >
            <FontAwesomeIcon
              icon={
                isHalf
                  ? faStarHalfAlt
                  : isFilled > index
                  ? faSolidStar
                  : faRegularStar
              }
              className="star-icon"
            />
          </div>
        );
      })}
    </div>
  );
};

export default Rating;
