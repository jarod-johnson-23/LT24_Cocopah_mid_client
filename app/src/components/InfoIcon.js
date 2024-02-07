import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import "./InfoIcon.css";
import infoIcon from "./images/info.svg";
import infoIconHover from "./images/info_hover.svg";

const InfoIcon = ({ text }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [popupStyle, setPopupStyle] = useState({});
  const infoIconRef = useRef(null);
  const popupRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      infoIconRef.current &&
      !infoIconRef.current.contains(event.target) &&
      popupRef.current &&
      !popupRef.current.contains(event.target)
    ) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    // Define the function inside the effect to ensure it has the current state and refs
    const handleClickOutside = (event) => {
      if (
        infoIconRef.current &&
        !infoIconRef.current.contains(event.target) &&
        popupRef.current &&
        !popupRef.current.contains(event.target)
      ) {
        setIsVisible(false);
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Return a cleanup function that removes the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isVisible && popupRef.current && infoIconRef.current) {
      const rect = infoIconRef.current.getBoundingClientRect();
      setPopupStyle({
        position: "absolute",
        top: `${
          rect.top + window.scrollY - popupRef.current.offsetHeight - 10
        }px`,
        left: `${rect.left + window.scrollX}px`,
      });
    }
  }, [isVisible]); // <-- Recalculate position when isVisible changes

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const popup = isVisible && (
    <div
      ref={popupRef}
      className="info-popup"
      style={popupStyle} // <-- Use state for style
    >
      {text}
    </div>
  );

  return (
    <>
      <div className="info-icon-container" ref={infoIconRef}>
        <img
          src={isHovering ? infoIconHover : infoIcon}
          alt="Info"
          className="info-icon"
          onClick={() => setIsVisible(!isVisible)}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        />
      </div>
      {ReactDOM.createPortal(popup, document.body)}
    </>
  );
};

export default InfoIcon;
