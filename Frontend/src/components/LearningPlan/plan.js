import React, { useState } from "react";
import axios from "axios";
import "./plan.css";

function LearningPlan() {
  const [planTitle, setPlanTitle] = useState("");
  const [topics, setTopics] = useState("");
  const [resources, setResources] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [learningPlans, setLearningPlans] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPlan = {
      title: planTitle,
      topics: topics.split(","),
      resources: resources.split(","),
      completionDate,
    };

    try {
      // API call to save the learning plan (replace with your API endpoint)
      const response = await axios.post("/api/learning-plans", newPlan);
      setLearningPlans([...learningPlans, response.data]);
      clearForm();
      setShowForm(false);
    } catch (error) {
      console.error("Error creating learning plan", error);
    }
  };

  // Clear form inputs
  const clearForm = () => {
    setPlanTitle("");
    setTopics("");
    setResources("");
    setCompletionDate("");
  };

  return (
    <div className="learning-plan-page">
      <h2>Learning Plans</h2>
      <button onClick={() => setShowForm(!showForm)} className="btn-create">
        {showForm ? "Cancel" : "Create Plan"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="learning-plan-form">
          <div className="form-group">
            <label>Plan Title:</label>
            <input
              type="text"
              value={planTitle}
              onChange={(e) => setPlanTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Topics (comma separated):</label>
            <input
              type="text"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Resources (comma separated):</label>
            <input
              type="text"
              value={resources}
              onChange={(e) => setResources(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Completion Date:</label>
            <input
              type="date"
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-submit">
            Save Plan
          </button>
        </form>
      )}

      <h3>Your Learning Plans</h3>
      <div className="plan-list">
        {learningPlans.length === 0 ? (
          <p>No learning plans created yet.</p>
        ) : (
          <ul>
            {learningPlans.map((plan, index) => (
              <li key={index}>
                <h4>{plan.title}</h4>
                <p>Topics: {plan.topics.join(", ")}</p>
                <p>Resources: {plan.resources.join(", ")}</p>
                <p>Completion Date: {plan.completionDate}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default LearningPlan;
