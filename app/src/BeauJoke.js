import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Typewriter from "./components/Typewriter";
import axios from "axios";
import { API_BASE_URL } from "./config";
import "./BeauJoke.css";

function BeauJoke() {
  const [joke, setJoke] = useState("");
  const [theme, setTheme] = useState("");
  const [previousJokes, setPreviousJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBeauJoke = async () => {
    setIsLoading(true);
    try {
      let body =
        previousJokes.length > 0
          ? {
              theme: theme,
              responses: {
                role: "assistant",
                content: previousJokes.join(" "),
              },
            }
          : {
              theme: theme,
            };

      const response = await axios.post(`${API_BASE_URL}/joke/beau`, body);

      if (response.status === 304) {
        alert("The joke was deemed inappropriate, please try again");
        setIsLoading(false);
        return;
      }
      setJoke(response.data);
      setPreviousJokes((prevJokes) => [...prevJokes, response.data].slice(-10));
    } catch (error) {
      console.error("Error fetching dad joke:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="beau-content">
      <Navbar />
      <div className="joke-gen-content">
        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="Enter a theme (optional)"
          className="beau-input"
        />
        <button onClick={fetchBeauJoke} className="beau-btn">
          Generate Beau Joke
        </button>

        <Typewriter text={joke} />
        {isLoading && <div className="spinner"></div>}
      </div>
    </div>
  );
}

export default BeauJoke;
