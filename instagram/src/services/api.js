const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

//   get auth headers (includes JWT if available) 
function authHeaders() {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// fetch with automatic logout on 401
function authFetch(url, options = {}) {
  return fetch(url, options).then((res) => {
    if (res.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return res;
  });
}


// GET all posts
export const fetchPosts = () =>
  authFetch(`${BASE_URL}/posts`, { headers: authHeaders() })
    .then((res) => res.json());

// GET posts for a specific user
export const fetchUserPosts = (userId) =>
  authFetch(`${BASE_URL}/posts?userId=${userId}`, { headers: authHeaders() })
    .then((res) => res.json());

// CREATE post
export const createPost = (post) =>
  authFetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(post),
  })
    .then((res) => res.json());

// DELETE post
export const deletePost = (id) =>
  authFetch(`${BASE_URL}/posts/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });


// LIKE / UNLIKE POST
export const likePost = (id, data) =>
  authFetch(`${BASE_URL}/posts/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
    .then((res) => res.json());



// ADD COMMENT
export const addComment = (postId, comments) =>
  authFetch(`${BASE_URL}/posts/${postId}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ comments }),
  }).then((res) => res.json());


// savePost
export const savePost = (id, savedBy) =>
  authFetch(`${BASE_URL}/posts/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ savedBy }),
  }).then((res) => res.json());


// UPDATE POST
export const updatePost = (id, data) =>
  authFetch(`${BASE_URL}/posts/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then((res) => res.json());



// ==================== PROFILE ====================

// PATCH bio for logged-in user
export const updateUserBio = (userId, bio) =>
  authFetch(`${BASE_URL}/users/${userId}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ bio }),
  }).then((res) => res.json());

// GET all users
export const fetchUsers = () =>
  authFetch(`${BASE_URL}/users`, { headers: authHeaders() })
    .then((res) => res.json());

// GET single user by ID
export const fetchUserById = (userId) =>
  authFetch(`${BASE_URL}/users/${userId}`, { headers: authHeaders() })
    .then((res) => res.json());


// ==================== SUGGESTIONS ====================

// GET profile shown in suggestions sidebar
export const fetchProfile = () =>
  authFetch(`${BASE_URL}/profile`, { headers: authHeaders() })
    .then((res) => res.json());

// GET suggested users
export const fetchSuggestions = () =>
  authFetch(`${BASE_URL}/suggestions`, { headers: authHeaders() })
    .then((res) => res.json());


// ==================== STORIES ====================

// GET all stories
export const fetchStories = () =>
  authFetch(`${BASE_URL}/stories`, { headers: authHeaders() })
    .then((res) => res.json());


// ==================== AUTH ====================

// LOGIN  calls POST /login
export const loginUser = async (username, password) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  // Store the JWT token
  localStorage.setItem('token', data.token);
  return [data.user]; 
};

// CHECK USERNAME 
export const checkUsername = (username) =>
  fetch(
    `${BASE_URL}/users?username=${encodeURIComponent(username)}`
  )
    .then((res) => res.json());

// CREATE USER 
export const createUser = (user) =>
  fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json());


// ==================== NOTIFICATIONS ====================

// GET notifications for a user — server-side filtering by toUserId
export const fetchNotifications = (userId) =>
  authFetch(`${BASE_URL}/notifications?toUserId=${userId}`, { headers: authHeaders() })
    .then((res) => res.json());

// CREATE notification
export const createNotification = (notification) =>
  authFetch(`${BASE_URL}/notifications`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(notification),
  }).then((res) => res.json());

// MARK notification as read
export const markNotificationRead = (id) =>
  authFetch(`${BASE_URL}/notifications/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ read: true }),
  }).then((res) => res.json());



// ==================== MESSAGES ====================

// GET messages between two users 
export const fetchMessages = (userId, otherUserId) =>
  authFetch(`${BASE_URL}/messages?user1=${userId}&user2=${otherUserId}`, { headers: authHeaders() })
    .then((res) => res.json());

    
export const createMessage = (message) =>
  authFetch(`${BASE_URL}/messages`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(message),
  }).then((res) => res.json());