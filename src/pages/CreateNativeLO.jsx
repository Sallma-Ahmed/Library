import React, { useState } from "react";
import Navbar from "../components/navbar";
import "../styles/CreateNativeLO.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

export default function CreateNativeLO() {
  const user = {
    name: "Salma Ahmed",
    avatar: "/images/icon.png",
  };

  const navigate = useNavigate();
  const { category } = useParams();

  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const subjectOptions = [
    { value: "Arabic", label: "Arabic" },
    { value: "English", label: "English" },
    { value: "Math", label: "Math" },
    { value: "Science", label: "Science" },
    { value: "Religion", label: "Religion" },
    { value: "Social", label: "Social Studies" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const learningObjective = {
      ...data,
      subjects: selectedSubjects.map((subject) => subject.value),
    };

    console.log("✅ Created LO:", learningObjective);
    localStorage.setItem("createdLO", JSON.stringify(learningObjective));
    alert("Learning Objective created!");
    navigate("/templates/native");
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(`/templates/${category || "native"}`);
  };

  return (
    <div>
      <Navbar
        user={user}
        onProfileClick={() => alert("Profile clicked")}
        onLogout={() => alert("Logged out")}
      />

      <section className="content">
        <nav className="breadcrumb">
          <Link to="/">Library</Link>
          <span className="separator">-</span>
          <Link to="/templates/native">Templates</Link>
          <span className="separator">-</span>
          <span className="active">Create Native LO</span>
        </nav>

        <div className="title">
          <h1>Create Native LO</h1>
          <p className="text">
            Add a new learning objective developed internally by the team.
          </p>
        </div>

        <form className="create-form" onSubmit={handleSubmit}>
          <label>
            Learning Objectives Name:
            <input type="text" name="loName" placeholder="Name" required />
          </label>

          <label>
            Thumbnail:
            <input type="file" name="thumbnail" />
          </label>

          <label>
            Subjects:
            <Select
              options={subjectOptions}
              isMulti
              name="subjects"
              placeholder="Select one or more subjects"
              value={selectedSubjects}
              onChange={setSelectedSubjects}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </label>

          <label>
            Created by:
            <input
              type="text"
              name="creator"
              placeholder="Developer Name"
              required
            />
          </label>

          <div className="button-row">
            <button type="submit" className="submit-btn">
              Create
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
