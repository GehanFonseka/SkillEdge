import "./App.css";
import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/home/Header";
import Footer from "./components/home/Footer";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Register from "./components/login/Register";
import api from "./api/axiosConfig";

function App() {
    const [authToken, setAuthToken] = useState(localStorage.getItem("token") || null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        setAuthToken(null);
        navigate("/login");
    };

    return (
        <div className="App">
            <Header authToken={authToken} onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
                <Route path="/register" element={<Register />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default App;
