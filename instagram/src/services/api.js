const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ==================== POSTS ====================

// GET all posts
export const fetchPosts = () =>
  fetch(`${BASE_URL}/posts`)
    .then((res) => res.json());

// GET posts for a specific user
export const fetchUserPosts = (userId) =>
  fetch(`${BASE_URL}/posts?userId=${userId}`)
    .then((res) => res.json());

// CREATE post
export const createPost = (post) =>
  fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  })
    .then((res) => res.json());

// DELETE post
export const deletePost = (id) =>
  fetch(`${BASE_URL}/posts/${id}`, {
    method: 'DELETE',
  });


// LIKE / UNLIKE POST
export const likePost = (id, data) =>
  fetch(`${BASE_URL}/posts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json());



// ADD COMMENT
export const addComment = (postId, comments) =>
  fetch(`${BASE_URL}/posts/${postId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ comments }),
  }).then((res) => res.json());


// savePost
export const savePost = (id, savedBy) =>
  fetch(`${BASE_URL}/posts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ savedBy }),
  }).then((res) => res.json());


// UPDATE POST
export const updatePost = (id, data) =>
  fetch(`${BASE_URL}/posts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());



// ==================== PROFILE ====================

// PATCH bio for logged-in user
export const updateUserBio = (userId, bio) =>
  fetch(`${BASE_URL}/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bio }),
  }).then((res) => res.json());


// ==================== SUGGESTIONS ====================

// GET profile shown in suggestions sidebar
export const fetchProfile = () =>
  fetch(`${BASE_URL}/profile`)
    .then((res) => res.json());

// GET suggested users
export const fetchSuggestions = () =>
  fetch(`${BASE_URL}/suggestions`)
    .then((res) => res.json());


// ==================== STORIES ====================

// GET all stories
export const fetchStories = () =>
  fetch(`${BASE_URL}/stories`)
    .then((res) => res.json());


// ==================== AUTH ====================

// LOGIN
export const loginUser = async (username, password) => {
  const res = await fetch(
    `${BASE_URL}/users?username=${encodeURIComponent(username)}`
  );

  const users = await res.json();

  return users.filter((user) => user.password === password);
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

// GET notifications for a user — fetch all and filter client-side
// (json-server ?toUserId= query can silently fail with certain ID formats)
export const fetchNotifications = (userId) =>
  fetch(`${BASE_URL}/notifications`)
    .then((res) => res.json())
    .then((all) => all.filter((n) => n.toUserId === userId));

// CREATE notification
export const createNotification = (notification) =>
  fetch(`${BASE_URL}/notifications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(notification),
  }).then((res) => res.json());

// MARK notification as read
export const markNotificationRead = (id) =>
  fetch(`${BASE_URL}/notifications/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ read: true }),
  }).then((res) => res.json());



// ==================== MESSAGES ====================

// GET messages between two users (both directions)
export const fetchMessages = (userId, otherUserId) =>
  fetch(`${BASE_URL}/messages`)
    .then((res) => res.json())
    .then((all) =>
      all.filter(
        (m) =>
          (m.senderId === userId && m.receiverId === otherUserId) ||
          (m.senderId === otherUserId && m.receiverId === userId)
      )
    );

// CREATE message
export const createMessage = (message) =>
  fetch(`${BASE_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  }).then((res) => res.json());