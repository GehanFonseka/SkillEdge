import api from "./axiosConfig";

export const createPost = async (postData) => {
    try {
        console.log("Sending formData:", postData);
        const response = await api.post("/api/posts/create", postData, {
            headers: {
                "Content-Type": "multipart/form-data", // ✅ Ensure it's set properly
            },
        });
        console.log(response);
        return response.data;
    } catch (error) {
        console.error("Error in createPost:", error.response ? error.response.data : error.message);
        throw error;
    }
};
  

export const getAllPosts = async () => {
    try {
        const response = await api.get("/api/posts");
        return response.data;
    } catch (error) {
        console.error("Error fetching posts:", error.response ? error.response.data : error.message);
        throw error;
    }
};
export const getPostById = (id) => api.get(`/posts/${id}`);
export const updatePost = (id, postData) => api.put(`/posts/${id}`, postData);
export const deletePost = (id) => api.delete(`/posts/${id}`);
export const likePost = (id) => api.post(`/posts/${id}/like`);
export const addComment = (id, comment) => api.post(`/posts/${id}/comment`, { comment });