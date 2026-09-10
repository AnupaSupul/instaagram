import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsers } from '../../services/api';
import './Search.css';

function Search() {
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    // Load all users once on mount
    useEffect(() => {
        fetchUsers()
            .then((data) => setUsers(data))
            .catch((err) => console.error('Error fetching users:', err));
    }, []);

    // Filter users by username (case-insensitive partial match)
    const results = query.trim()
        ? users.filter((u) =>
            u.username.toLowerCase().includes(query.toLowerCase())
        )
        : [];

    return (
        <div className="search-page">
            <h2 className="search-title">Search</h2>

            <input
                className="search-input"
                type="text"
                placeholder="Search profiles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            <div className="search-results">
                {query.trim() === '' ? (
                    <div className="search-hint">
                        <i className="bi bi-search"></i>
                        <p>Search for profiles by username</p>
                    </div>
                ) : results.length === 0 ? (
                    <div className="search-hint">
                        <p>No users found for "{query}"</p>
                    </div>
                ) : (
                    results.map((user) => (
                        <div
                            key={user.id}
                            className="search-result-item"
                            onClick={() => navigate(`/profile/${user.id}`)}
                        >
                            <img
                                src={user.profilePicture}
                                alt={user.username}
                                className="search-avatar"
                            />
                            <div className="search-user-info">
                                <span className="search-username">{user.username}</span>
                                {user.fullName && (
                                    <span className="search-fullname">{user.fullName}</span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Search;
