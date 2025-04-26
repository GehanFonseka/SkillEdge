import React, { useEffect, useState } from "react";
import { getAllPosts } from "../../api/postapi";
import "./ViewPosts.css";


const ViewPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getAllPosts();
                console.log("Fetched posts:", data);
                console.log("lllll",data[0].mediaUrls[0]) // Debugging: Log the posts
                setPosts(data);
            } catch (err) {
                setError("Failed to fetch posts. Please try again later.");
                console.error("Error fetching posts:", err);
            } finally {
                setLoading(false);
            }
        };
    
        fetchPosts();
    }, []);

    if (loading) return <p>Loading posts...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="posts-container">
            <h2>All Posts</h2>
            {posts.length === 0 ? (
                <p>No posts available.</p>
            ) : (
                <div className="posts-grid">
                    {posts.map((post) => (
                        <div key={post.id} className="post-card">
                            <h3>{post.title}</h3>
                            <p>{post.description}</p>
                            {post.mediaUrls && post.mediaUrls.length > 0 && (
    <div className="media-container">
    {post.mediaUrls.map((url, index) => {
        console.log("Media URL:", url); // Log the URL before rendering the image
        return (
            <img
                key={index}
                src={`http://localhost:9191/${url.split("/").pop()}`}

                alt={`Media ${index + 1}`}
                // onError={(e) => {
                //     e.target.src = "/fallback-image.png"; // Optional: Fallback image
                //     e.target.alt = "Image not available";
                // }}
            />
        );
    })}
</div>
)}
                            <div className="post-footer">
                                <span>{post.likes} Likes</span>
                                <span>{post.comments.length} Comments</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewPosts;