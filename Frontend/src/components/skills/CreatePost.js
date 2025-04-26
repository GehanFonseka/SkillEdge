import React, { useState } from "react";
import { createPost } from "../../api/postapi";

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        files.forEach((file) => formData.append("files", file));

        try {
            setLoading(true);
            await createPost(formData);
            alert("Post created successfully!");
        } catch (error) {
            console.error("Error creating post:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <input type="file" multiple onChange={(e) => setFiles([...e.target.files])} />
            <button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Post"}</button>
        </form>
    );
};

export default CreatePost;