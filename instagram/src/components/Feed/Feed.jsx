// src/Feed.jsx
import Stories from './Stories';
import Posts from './Posts';

function Feed() {
  return (
    <div className="feed-container">
      <Stories />
      <Posts />
    </div>
  );
}
export default Feed;