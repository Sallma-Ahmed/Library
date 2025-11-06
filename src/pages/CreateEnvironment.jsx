import React, { useState } from "react";
import Navbar from "../components/navbar";
import "../styles/CreateNativeLO.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

// Grade options for the dropdown
const gradeOptions = [
  { value: "Grade 1", label: "Grade 1" },
  { value: "Grade 2", label: "Grade 2" },
  { value: "Grade 3", label: "Grade 3" },
];

export default function CreateEnvironment() {
  const user = {
    name: "Salma Ahmed",
    avatar: "/images/icon.png",
  };

  const navigate = useNavigate();
  const { team } = useParams();

  const [envId] = useState(Date.now());
  const [selectedGrades, setSelectedGrades] = useState([]);

  const handleGradeChange = (selectedOptions) => {
    setSelectedGrades(selectedOptions || []);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const newEnv = {
      envId,
      name: data.name,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      demoUrl: data.demoUrl,
      grades: selectedGrades.map((grade) => grade.value),
      serverPaths: {
        sb: data.sb,
        gd: data.gd,
      },
    };

    const existing = JSON.parse(localStorage.getItem("environments") || "[]");
    localStorage.setItem("environments", JSON.stringify([...existing, newEnv]));

    console.log("✅ Created Environment:", newEnv);
    alert("Environment created!");
    navigate(`/templates/${team || "native"}`);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(`/templates/${team || "native"}`);
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
          <Link to={`/templates/${team || "native"}`}>Templates</Link>
          <span className="separator">-</span>
          <span className="active">Create {team || "Native"} Environment</span>
        </nav>

        <div className="title">
          <h1>Create {team || "Native"} Environment</h1>
          <p className="text">
            Add a new environment developed internally by the team.
          </p>
        </div>

        <form className="create-form" onSubmit={handleSubmit}>
          <label>
            Environment Name:
            <input type="text" name="name" placeholder="Environment Name" required />
          </label>

          <label>
            Thumbnail:
            <input type="file" name="thumbnail" />
          </label>

          <label>
            Grades:
            <Select
              options={gradeOptions}
              isMulti
              name="grades"
              placeholder="Select one or more grades."
              value={selectedGrades}
              onChange={handleGradeChange}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </label>

          <label>
            Demo URL:
            <input type="text" name="demoUrl" placeholder="Demo URL" required />
          </label>

          <label>
            SB Link:
            <input type="text" name="sb" placeholder="SB Link" />
          </label>

          <label>
            GD Link:
            <input type="text" name="gd" placeholder="GD Link" />
          </label>

          <div className="button-row">
            <button type="submit" className="submit-btn">
              Create
            </button>
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
