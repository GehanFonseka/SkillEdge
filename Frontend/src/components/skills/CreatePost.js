import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = () => {
    const [description, setDescription] = useState('');
    const [mediaFiles, setMediaFiles] = useState([]);

    const handleFileChange = (e) => {
        setMediaFiles([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('description', description);
        mediaFiles.forEach(file => {
            formData.append('mediaFiles', file);
        });

        await axios.post('/api/posts', formData);
        setDescription('');
        setMediaFiles([]);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a description"
                    required
                ></textarea>
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                    required
                />
                <button type="submit">Create Post</button>
            </form>
        </div>
    );
};

export default CreatePost;
