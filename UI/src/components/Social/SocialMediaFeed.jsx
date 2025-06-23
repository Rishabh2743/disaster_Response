import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SocialMediaFeed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await axios.get('/api/social-media/1');
    setPosts(res.data.posts);
  };

  return (
    <ul className="space-y-1">
      {posts.map((p, i) => (
        <li key={i}>{p.user}: {p.post}</li>
      ))}
    </ul>
  );
};

export default SocialMediaFeed;