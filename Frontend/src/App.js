import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router";
import { useNavigate } from "react-router-dom";
import AddLearningPlan from "./Pages/LearningPlan/AddLearningPlan";
import AllLearningPlan from "./Pages/LearningPlan/AllLearningPlan";
import UpdateLearningPlan from "./Pages/LearningPlan/UpdateLearningPlan";
import UserLogin from "./Pages/UserManagement/UserLogin";
import UserRegister from "./Pages/UserManagement/UserRegister";
import UpdateUserProfile from "./Pages/UserManagement/UpdateUserProfile";
import AddAchievements from "./Pages/AchievementsManagement/AddAchievements";
import AllAchievements from "./Pages/AchievementsManagement/AllAchievements";
import UpdateAchievements from "./Pages/AchievementsManagement/UpdateAchievements";
import NotificationsPage from "./Pages/NotificationManagement/NotificationsPage";
import AddNewPost from "./Pages/PostManagement/AddNewPost";
import AllPost from "./Pages/PostManagement/AllPost";
import UpdatePost from "./Pages/PostManagement/UpdatePost";
import UserProfile from "./Pages/UserManagement/UserProfile";
import MyAchievements from "./Pages/AchievementsManagement/MyAchievements";
import MyAllPost from "./Pages/PostManagement/MyAllPost";
import GoogalUserPro from "./Pages/UserManagement/GoogalUserPro";
import MyLearningPlan from "./Pages/LearningPlan/MyLearningPlan";

function ProtectedRoute({ children }) {
  const userID = localStorage.getItem("userID");
  if (!userID) {
    return <Navigate to="/" />;
  }
  return children;
}

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === "/oauth2/success") {
      const params = new URLSearchParams(window.location.search);
      const userID = params.get("userID");
      const name = params.get("name");
      const googleProfileImage = decodeURIComponent(params.get("googleProfileImage")); // Decode the URL

      if (userID && name) {
        localStorage.setItem("userID", userID);
        localStorage.setItem("userType", "google");
        if (googleProfileImage) {
          localStorage.setItem("googleProfileImage", googleProfileImage); // Save decoded URL
        }
        navigate("/allPost");
      } else {
        alert("Login failed. Missing user information.");
      }
    }
  }, [navigate]);

  return (
    <div>
      <React.Fragment>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />

          {/* Protected Routes */}
          <Route
            path="/addLearningPlan"
            element={
              <ProtectedRoute>
                <AddLearningPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/allLearningPlan"
            element={
              <ProtectedRoute>
                <AllLearningPlan />
              </ProtectedRoute>
            }
          />
           <Route
            path="/myLearningPlan"
            element={
              <ProtectedRoute>
                <MyLearningPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/updateLearningPlan/:id"
            element={
              <ProtectedRoute>
                <UpdateLearningPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/updateUserProfile/:id"
            element={
              <ProtectedRoute>
                <UpdateUserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/userProfile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
             <Route
            path="/googalUserPro"
            element={
              <ProtectedRoute>
                <GoogalUserPro />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addAchievements"
            element={
              <ProtectedRoute>
                <AddAchievements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/allAchievements"
            element={
              <ProtectedRoute>
                <AllAchievements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/myAchievements"
            element={
              <ProtectedRoute>
                <MyAchievements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/updateAchievements/:id"
            element={
              <ProtectedRoute>
                <UpdateAchievements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addNewPost"
            element={
              <ProtectedRoute>
                <AddNewPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/allPost"
            element={
              <ProtectedRoute>
                <AllPost />
              </ProtectedRoute>
            }
          />
           <Route
            path="/myAllPost"
            element={
              <ProtectedRoute>
                <MyAllPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/updatePost/:id"
            element={
              <ProtectedRoute>
                <UpdatePost />
              </ProtectedRoute>
            }
          />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
