import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostsList = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get('/api/posts').then((response) => {
            setPosts(response.data);
        });
    }, []);

    return (
        <div>
            {posts.map((post) => (
                <div key={post.id}>
                    <p>{post.description}</p>
                    {post.mediaFiles.map((file) => (
                        <div key={file.id}>
                            <img src={file.mediaUrl} alt="Post media" />
                        </div>
                    ))}
                    <button>Like</button>
                    <button>Comment</button>
                </div>
            ))}
        </div>
    );
};

export default PostsList;
