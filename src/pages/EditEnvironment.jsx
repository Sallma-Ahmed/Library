import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/navbar";
import Select from "react-select";
import "../styles/CreateNativeLO.css";

import templatesData from "../json/data.json";

export default function UpdateEnvironment() {
const { templateId, envId } = useParams();
  const navigate = useNavigate();

const template = templatesData.find(item => item.id === Number(templateId));
const environment = template?.environments.find(env => env.envId === Number(envId));

  // grades handling - only if you add grades to your data
  const gradeOptions = [
    { value: "1st", label: "1st" },
    { value: "2nd", label: "2nd" },
    { value: "3rd", label: "3rd" },
    { value: "4th", label: "4th" },
    { value: "5th", label: "5th" },
    { value: "6th", label: "6th" },
  ];

  const [selectedGrade, setSelectedGrade] = useState(null);

  useEffect(() => {
    if (Array.isArray(environment?.grades)) {
      setSelectedGrade(
        environment.grades.map((grade) => ({ value: grade, label: grade }))
      );
    }
  }, [environment]);

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const handleSave = (e) => {
    e.preventDefault();

    const updatedEnvironment = {
      environmentName: e.target.environmentName.value,
      thumbnail: e.target.thumbnail.value,
      grades: selectedGrade?.map((g) => g.value) || [],
      demoURL: e.target.demoURL.value,
      serverPaths: {
        sb: e.target.sbPath.value,
        gd: e.target.gdPath.value,
      },
    };

    console.log("Updated Environment:", updatedEnvironment);
    alert(`Changes for environment "${updatedEnvironment.environmentName}" saved!`);
    navigate("/templates/environments");
  };

  if (!template || !environment) {
    return <p>Template or Environment not found</p>;
  }

  return (
    <div>
      <Navbar user={{ name: "Salma Ahmed", avatar: "/images/icon.png" }} />

      <section className="content">
        <nav className="breadcrumb">
          <Link to="/">Library</Link>
          <span className="separator">—</span>
          <Link to="/templates/environments">Templates</Link>
          <span className="separator">—</span>
          <span className="active">Update Environment</span>
        </nav>

        <div className="title">
          <h1>Update {environment.name}</h1>
          <p className="text">
            Update environment of the learning objective developed internally by the team.
          </p>
        </div>

        <form className="create-form" onSubmit={handleSave}>
          <label>
            Environment Name:
            <input
              type="text"
              name="environmentName"
              defaultValue={environment.name}
              required
            />
          </label>

          <label>
            Thumbnail:
            <input
              type="text"
              name="thumbnail"
              defaultValue={template.img || "Thumbnail.png"}
              required
            />
          </label>

          {/* Remove grades if no grades in your data, or add grades to environments */}
          <label>
            Grades:
            <Select
              options={gradeOptions}
              isMulti
              name="grades"
              value={selectedGrade}
              onChange={setSelectedGrade}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </label>

          <label>
            Demo URL:
            <input type="text" name="demoURL" defaultValue={environment.demoUrl} />
          </label>

          <label>
            SB Server Path:
            <input type="text" name="sbPath" defaultValue={environment.serverPaths?.sb} />
          </label>

          <label>
            GD Server Path:
            <input type="text" name="gdPath" defaultValue={environment.serverPaths?.gd} />
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
