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
export const likePost=(id,data)=>
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

// GET current user profile
export const fetchUserProfile = () =>
  fetch(`${BASE_URL}/userProfile`)
    .then((res) => res.json());

// UPDATE bio
export const updateBio = (bio) =>
  fetch(`${BASE_URL}/userProfile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bio }),
  })
    .then((res) => res.json());


// ==================== SUGGESTIONS ====================

// GET profile shown in suggestions
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
export const loginUser = (username, password) =>
  fetch(
    `${BASE_URL}/users?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
  )
    .then((res) => res.json());

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