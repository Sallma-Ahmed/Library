import { Link } from "react-router-dom";
import data from "../json/data.json";
import Navbar from "../components/navbar";
import "../styles/startPage.css";

const categories = [
  {
    name: "Native Development",
    route: "Native-Development",
    img: "/images/interactive.jpg",
    teamLeader: "Ahmed Fares",
  },
  {
    name: "Animate Development",
    route: "games",
    img: "/images/games.jpg",
    teamLeader: "Islam Tawfik",
  },
  {
    name: "Exercises",
    route: "exercise",
    img: "/images/interactive.jpg",
    teamLeader: "Ahmed Fares",
  },
];

export default function StartPage() {
  const categoryCounts = data.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});
  const user = {
    name: "Salma Ahmed",
    avatar: "/images/icon.png",
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
            <a href="/">Library</a>
          </nav>

          <h1>Learning Objectives Types</h1>
          <p className="sub-title">
            Choose the type of objectives you want to work on.
          </p>
        </div>
        <div className="card-container">
          {categories.map((cat) => {
            const teamLeader = cat.teamLeader || "N/A";

            return (
              <div key={cat.route} className={`card ${cat.route}`}>
                <div className="card-body">
                  <div className="row">
                    <h3 className="card-title">{cat.name}</h3>
                    <p className="text">
                      <span className="number">
                        {categoryCounts[cat.route] || 0}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="btn row ">
             <div className="teamLeader">
                     <img
                      src={user.avatar || "/images/default-avatar.png"}
                      className="avatar"
                    />{" "}
                    <p className="name">{teamLeader}</p>
             </div>
                  <Link
                    to={`/templates/${cat.route}`}
                    className="details-btn"
                  ></Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
