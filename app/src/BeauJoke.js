import "./BeauJoke.css";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Typewriter from "./components/Typewriter";
import axios from "axios";
import { API_BASE_URL } from "./config";

function BeauJoke() {
  const [joke, setJoke] = useState("");
  const [theme, setTheme] = useState("");
  const [previousJokes, setPreviousJokes] = useState("");

  const fetchBeauJoke = async () => {
    try {
      let body = "";
      if (previousJokes) {
        body = {
          theme: theme,
          responses: {
            role: "assistant",
            content: previousJokes.join(" "),
          },
        };
      } else {
        body = {
          theme: theme,
        };
      }
      // Logic to fetch the dad joke based on the theme
      const response = await axios.post(`${API_BASE_URL}/joke/beau`, body);

      if (response.status === 304) {
        alert("The joke was deemed inappropriate, please try again");
        return;
      }
      setJoke(response.data);
      setPreviousJokes((prevJokes) => [...prevJokes, response.data].slice(-10));
    } catch (error) {
      console.error("Error fetching dad joke:", error);
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
      </div>
    </div>
  );
}

export default BeauJoke;
