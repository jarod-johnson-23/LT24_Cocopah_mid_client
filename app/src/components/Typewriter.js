import React, { useState, useEffect, useRef } from "react";
import "./Typewriter.css"; // Make sure to create this CSS file

const Typewriter = ({ text, minDelay = 10, maxDelay = 100 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const prevText = useRef(text);

  // Function to return a random typing delay
  const getRandomDelay = (minDelay, maxDelay) => {
    return Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay);
  };

  useEffect(() => {
    let timeoutId;

    if (text !== prevText.current) {
      setIsDeleting(true);
    }

    if (isDeleting) {
      if (displayedText.length > 0) {
        // Deleting characters
        timeoutId = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, minDelay);
      } else {
        // Once deletion is complete, start typing new text
        setIsDeleting(false);
        prevText.current = text;
      }
    } else {
      if (displayedText !== text) {
        // Typing characters
        timeoutId = setTimeout(() => {
          setDisplayedText(text.slice(0, displayedText.length + 1));
        }, getRandomDelay(minDelay, maxDelay));
      }
    }

    return () => clearTimeout(timeoutId);
  }, [displayedText, isDeleting, text, minDelay, maxDelay]);

  return (
    <div className="typewriter">
      <span className="typewriter-text">{displayedText}</span>
      <span className="cursor">|</span>
    </div>
  );
};

export default Typewriter;
