import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import data from "../json/data.json";
import TemplatesCard from "../components/templatesCard";
import Navbar from "../components/navbar";
import "../styles/TemplatesPage.css";
import { useNavigate } from "react-router-dom";

const subjects = ["All", "Arabic", "English", "Rel", "Mth", "Sci", "Social"];

export default function TemplatesPage() {
    const navigate = useNavigate();
  const { category } = useParams();
  const [selectedSubject, setSelectedSubject] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filtered = data.filter(
    (t) =>
      t.category === category &&
      (selectedSubject === "All" || t.subject === selectedSubject)
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  const user = {
    name: "Salma Ahmed",
    avatar: "/images/icon.png",
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div>
      <Navbar
        user={user}
        onProfileClick={() => alert("Profile clicked")}
        onLogout={() => alert("Logged out")}
      />

      <section className="content">
        <div className="title">
          <nav className="breadcrumb">
            <a href="/">Library</a> <span className="separator">-</span>
            <a href={`/templates/${category}`} className="active">
              Templates
            </a>
          </nav>
          <div className="row">
            <div className="coloumn">
              <h1>{category} LOs</h1>
              <p className="sub-title">
                Objectives built internally using in-house tools or code
                frameworks.
              </p>
            </div>
            <button className="create-btn" onClick={() => navigate("/create")}>+ Create LO</button>
          </div>

          <div className="subject-btn">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => {
                  setSelectedSubject(sub);
                  setCurrentPage(1);
                }}
                className={`subject-btn button ${
                  selectedSubject === sub ? "active" : "hover"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        <div className="card-flex">
          {paginated.length > 0 ? (
            paginated.map((t) => (
              <Link
                className="templates-cards"
                key={t.id}
                to={`/environments/${t.id}`}
              >
                <TemplatesCard template={t} />
              </Link>
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-500">
              No templates found
            </p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button className="borderNone"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ◀ 
            </button>

           {[...Array(totalPages)].map((_, i) => (
  <button
    key={i}
    className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
    onClick={() => handlePageChange(i + 1)}
  >
    {i + 1}
  </button>
))}


            <button className="borderNone"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
               ▶
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
