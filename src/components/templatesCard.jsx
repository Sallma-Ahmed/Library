import { FaArrowRight, FaEdit } from "react-icons/fa";
import { useState } from "react";
import "../styles/TemplatesCard.css"; 

export default function TemplatesCard({ template }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(template.name);

  const handleEditClick = (e) => {
    e.preventDefault(); 
    setIsEditing(!isEditing);
  };

  return (
    <div className="template-card">
   <div className="template-image">
        <img
          src={template.img || "/images/placeholder.png"}
          alt={template.name}
        />
      </div>


      <span className="template-subject">{template.subject}</span>

   
      <div className="template-name">
        {isEditing ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setIsEditing(false)}
            className="name-input"
          />
        ) : (
          <h3>{name}</h3>
        )}
        <FaEdit className="edit-icon" onClick={handleEditClick} />
      </div>

      <div className="template-footer">
        <div className="creator">

          <div>
            <p className="by-text">Created by</p>
            <p className="creator-name">{template.creator || "Salma Ahmed"}</p>
          </div>
          <div className="arrow-btn">
        </div>
        </div>
        
      </div>
    </div>
  );
}
