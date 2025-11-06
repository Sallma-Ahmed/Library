import { useParams, useNavigate } from "react-router-dom";
import data from "../json/data.json";
import Navbar from "../components/navbar";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom"; 

export default function EnvironmentsPage() {
const { category, id } = useParams();
  const navigate = useNavigate();

  const template = data.find((t) => t.id === Number(id));

  if (!template)
    return (
      <div className="template-details">
        <div className="template-card">
          <h2>Template not found</h2>
        </div>
      </div>
    );

  const user = {
    name: "Salma Ahmed",
    avatar: "/images/icon.png",
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar
        user={user}
        onProfileClick={() => alert("Profile clicked")}
        onLogout={() => alert("Logged out")}
      />

      <section className="content">
        <div className="title">
  <nav className="breadcrumb">
  <Link to="/">Library</Link>
  <span className="separator">-</span>

  <Link to={`/templates/${category}`}>
    Templates
  </Link>
  <span className="separator">-</span>

  <Link to={`/environments/${id}`} className="active">
    Environments
  </Link>
</nav>
<div className="row">
  <div className="coloumn">
    <h1>{template.name} Environments</h1>
    <p className="sub-title">
      Choose the environments of objectives you want to see details.
    </p>
  </div>

  <button
    className="create-btn"
onClick={() => navigate("/createEnvironment")}
  >
    + Create Environment
  </button>
</div>

        </div>

        <div className="template-details">
          <div className="template-card">
            <div className="env-list">
              {template.environments?.map((env, index) => (
                <div
                  key={env.envId}
                  className="env-card"
                  onClick={() => navigate(`/environments/${id}/${env.envId}`)}
                >
                  <div className="env-image">
                    <img src={template.img} alt={template.name} />
                  </div>

                  <div className="env-info">
                    <div className="env-header">
                      {/* <span className="env-badge">{index + 1}st</span> */}
                      <h3>
                        {template.name} ({env.name})
                      </h3>
<button
  className="env-edit"
  onClick={(e) => {
    e.stopPropagation();
    navigate(`/editEnvironment/${id}/${env.envId}`);
  }}
>
  <FaEdit className="edit-icon" />
</button>

                    </div>
                    <div className="envfooter">
                        <div className="env-subtitle">
                        <p>Created on</p>
                        <p className="env-date">{env.date}</p>
                      </div>
                      <div className="arrow-btn"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

  
      </section>
    </div>
  );
}
