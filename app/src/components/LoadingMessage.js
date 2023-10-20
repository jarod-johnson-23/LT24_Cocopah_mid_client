import React, { useState, useEffect } from "react";
import "./LoadingMessage.css";

function LoadingMessage() {
  const [dots, setDots] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDots((prevDots) => (prevDots === 3 ? 1 : prevDots + 1));
    }, 500); // Update every 500ms

    return () => clearTimeout(timer); // Clear timeout on component unmount
  }, [dots]);

  return (
    <div className="text">
      Heatmap is being generated{Array(dots).fill(".").join("")}
    </div>
  );
}

export default LoadingMessage;
