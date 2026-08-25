// src/Suggestions.jsx
import { useState, useEffect } from 'react';
import {
  fetchProfile,
  fetchSuggestions,
} from '../../services/api';


const Suggestions = () => {
  const [profile, setProfile]         = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    fetchProfile()
      .then((data) => setProfile(data))
      .catch((err) => console.log('Profile fetch error:', err));
    fetchSuggestions()
      .then((data) => setSuggestions(data))
      .catch((err) => console.log('Suggestions fetch error:', err));
  }, []);
  return (
    <div className="suggestions">
      {/* ── Profile header ── */}
      {profile ? (
        <div className="d-flex align-items-center mb-3">
          <img
            src={profile.profile_pic}
            alt="Profile"
            className="dp rounded-circle"
          />
          <h5 className="ms-2 mb-0">{profile.username}</h5>
          <small className="text-primary ms-auto cursor-pointer">Switch</small>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      {/* ── Suggestions header ── */}
      <div className="d-flex justify-content-between my-2">
        <p className="fw-bold mb-0">Suggested for you</p>
        <p className="fw-bold mb-0 cursor-pointer">See All</p>
      </div>
      {/* ── Suggestions list ── */}
      {suggestions.length > 0 ? (
        suggestions.map((suggestion) => (
          <div key={suggestion.id} className="d-flex align-items-center my-2">
            <img
              src={suggestion.profile_pic}
              alt="Profile"
              className="dp rounded-circle"
            />
            <span className="ms-2">{suggestion.username}</span>
            <small className="text-primary ms-auto cursor-pointer">Follow</small>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
export default Suggestions;