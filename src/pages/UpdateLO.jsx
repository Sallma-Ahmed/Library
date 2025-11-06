import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/navbar";
import Select from "react-select";
import "../styles/CreateNativeLO.css";

import templatesData from "../json/data.json";

export default function UpdateLO() {
  const { id } = useParams();
  const navigate = useNavigate();

  const template = templatesData.find((item) => item.id === Number(id));

  const subjectOptions = [
    { value: "Arabic", label: "Arabic" },
    { value: "English", label: "English" },
    { value: "Math", label: "Math" },
    { value: "Science", label: "Science" },
    { value: "Religion", label: "Religion" },
    { value: "Social", label: "Social Studies" },
  ];

  const [selectedSubjects, setSelectedSubjects] = useState([]);

  useEffect(() => {
    if (template?.subject) {
      setSelectedSubjects([
        { value: template.subject, label: template.subject },
      ]);
    }
  }, [template]);

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const handleSave = (e) => {
    e.preventDefault();

    const updatedLO = {
      loName: e.target.loName.value,
      creator: e.target.creator.value,
      subjects: selectedSubjects.map((subj) => subj.value),
    };

    console.log("Updated LO:", updatedLO);
    alert(`Changes for LO ${template.name} saved!`);
    navigate("/templates/native");
  };

  return (
    <div>
      <Navbar user={{ name: "Salma Ahmed", avatar: "/images/icon.png" }} />

      <section className="content">
        <nav className="breadcrumb">
          <Link to="/">Library</Link>
          <span className="separator">-</span>
          <Link to="/templates/native">Templates</Link>
          <span className="separator">-</span>
          <span className="active">Update LO</span>
        </nav>

        <div className="title">
          <h1>Update {template?.name}</h1>
          <p className="text">
            Update learning objective developed internally by the team.
          </p>
        </div>

        <form className="create-form" onSubmit={handleSave}>
          <label>
            Learning Objective Name:
            <input
              type="text"
              name="loName"
              defaultValue={template?.name}
              placeholder="Name"
              required
            />
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
              defaultValue={template?.creator}
              required
            />
          </label>

          <div className="button-row">
            <button type="submit" className="submit-btn">
              Save Changes
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
