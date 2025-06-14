import { useState, useEffect } from "react";

const SearchBox = ({ placeholder, onSelect, value, setValue }) => {
  const API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;

  const geocode = async () => {
    if (!value.trim()) return;
    try {
      const res = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          value
        )}&key=${API_KEY}&limit=1`
      );
      const data = await res.json();
      if (data?.results?.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        onSelect({ lat, lng }, data.results[0].formatted);
      } else {
        alert("Location not found.");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      alert("Geocoding failed.");
    }
  };

  return (
    <div className="search-box">
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={geocode}>Search</button>
    </div>
  );
};

export default SearchBox;
